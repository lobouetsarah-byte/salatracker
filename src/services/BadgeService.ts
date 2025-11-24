import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notifications';

export interface Badge {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
}

export interface BadgeDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalPrayers: number;
  consecutiveDays: number;
  totalDhikr: number;
  prayersThisWeek: number;
  prayersThisMonth: number;
  onTimePrayers: number;
}

const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    type: 'first_prayer',
    name: 'Première Prière',
    description: 'Accomplir votre première prière',
    icon: '🌟',
    condition: (stats) => stats.totalPrayers >= 1,
  },
  {
    type: 'week_streak',
    name: 'Semaine Parfaite',
    description: 'Accomplir toutes les prières pendant 7 jours consécutifs',
    icon: '📅',
    condition: (stats) => stats.consecutiveDays >= 7,
  },
  {
    type: 'month_streak',
    name: 'Mois Béni',
    description: 'Accomplir toutes les prières pendant 30 jours consécutifs',
    icon: '🌙',
    condition: (stats) => stats.consecutiveDays >= 30,
  },
  {
    type: 'hundred_prayers',
    name: 'Centenaire',
    description: 'Accomplir 100 prières',
    icon: '💯',
    condition: (stats) => stats.totalPrayers >= 100,
  },
  {
    type: 'five_hundred_prayers',
    name: 'Assidu',
    description: 'Accomplir 500 prières',
    icon: '⭐',
    condition: (stats) => stats.totalPrayers >= 500,
  },
  {
    type: 'punctual',
    name: 'Ponctuel',
    description: 'Accomplir 50 prières à l\'heure',
    icon: '⏰',
    condition: (stats) => stats.onTimePrayers >= 50,
  },
  {
    type: 'dhikr_master',
    name: 'Maître du Dhikr',
    description: 'Compléter 100 sessions de dhikr',
    icon: '📿',
    condition: (stats) => stats.totalDhikr >= 100,
  },
];

class BadgeService {
  private static instance: BadgeService;

  private constructor() {}

  static getInstance(): BadgeService {
    if (!BadgeService.instance) {
      BadgeService.instance = new BadgeService();
    }
    return BadgeService.instance;
  }

  async checkAndAwardBadges(userId: string, stats: UserStats): Promise<Badge[]> {
    const newBadges: Badge[] = [];

    try {
      const { data: existingBadges } = await supabase
        .from('badges')
        .select('badge_type')
        .eq('user_id', userId);

      const earnedTypes = new Set(existingBadges?.map((b) => b.badge_type) || []);

      for (const definition of BADGE_DEFINITIONS) {
        if (!earnedTypes.has(definition.type) && definition.condition(stats)) {
          const { data: badge, error } = await supabase
            .from('badges')
            .insert({
              user_id: userId,
              badge_type: definition.type,
              badge_name: definition.name,
              badge_description: definition.description,
            })
            .select()
            .single();

          if (!error && badge) {
            newBadges.push({
              id: badge.id,
              type: definition.type,
              name: definition.name,
              description: definition.description,
              icon: definition.icon,
            });

            this.showBadgeNotification(definition);
          }
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }

    return newBadges;
  }

  private showBadgeNotification(badge: BadgeDefinition): void {
    notify.success(
      `🎉 Nouveau badge débloqué !`,
      `${badge.icon} ${badge.name}: ${badge.description}`,
      {
        duration: 6000,
      }
    );
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((b) => {
        const definition = BADGE_DEFINITIONS.find((d) => d.type === b.badge_type);
        return {
          id: b.id,
          type: b.badge_type,
          name: b.badge_name,
          description: b.badge_description || '',
          icon: definition?.icon || '🏆',
        };
      });
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  }

  async calculateUserStats(userId: string): Promise<UserStats> {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { count: totalPrayers } = await supabase
        .from('prayer_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['on-time', 'late']);

      const { count: prayersThisWeek } = await supabase
        .from('prayer_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('prayer_date', weekAgo.toISOString().split('T')[0])
        .in('status', ['on-time', 'late']);

      const { count: prayersThisMonth } = await supabase
        .from('prayer_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('prayer_date', monthAgo.toISOString().split('T')[0])
        .in('status', ['on-time', 'late']);

      const { count: onTimePrayers } = await supabase
        .from('prayer_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'on-time');

      const { count: totalDhikr } = await supabase
        .from('dhikr_tracking')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true);

      const consecutiveDays = await this.calculateConsecutiveDays(userId);

      return {
        totalPrayers: totalPrayers || 0,
        consecutiveDays,
        totalDhikr: totalDhikr || 0,
        prayersThisWeek: prayersThisWeek || 0,
        prayersThisMonth: prayersThisMonth || 0,
        onTimePrayers: onTimePrayers || 0,
      };
    } catch (error) {
      console.error('Error calculating user stats:', error);
      return {
        totalPrayers: 0,
        consecutiveDays: 0,
        totalDhikr: 0,
        prayersThisWeek: 0,
        prayersThisMonth: 0,
        onTimePrayers: 0,
      };
    }
  }

  private async calculateConsecutiveDays(userId: string): Promise<number> {
    try {
      const { data: prayers } = await supabase
        .from('prayer_tracking')
        .select('prayer_date')
        .eq('user_id', userId)
        .in('status', ['on-time', 'late'])
        .order('prayer_date', { ascending: false });

      if (!prayers || prayers.length === 0) return 0;

      const uniqueDates = [...new Set(prayers.map((p) => p.prayer_date))].sort().reverse();

      let streak = 0;
      const today = new Date().toISOString().split('T')[0];
      let expectedDate = new Date(today);

      for (const dateStr of uniqueDates) {
        const checkDate = expectedDate.toISOString().split('T')[0];

        if (dateStr === checkDate) {
          streak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating consecutive days:', error);
      return 0;
    }
  }
}

export const badgeService = BadgeService.getInstance();
