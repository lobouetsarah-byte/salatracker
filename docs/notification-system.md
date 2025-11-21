# Notification System Documentation

## Overview
The notification system provides a centralized, consistent way to display user feedback throughout the application.

## Location
`/src/lib/notifications.ts`

## Usage

### Import
```typescript
import { notify } from "@/lib/notifications";
```

## API Reference

### General Notifications

#### Success
```typescript
notify.success(title: string, description?: string, options?: NotificationOptions)
```
**Example:**
```typescript
notify.success("Settings saved", "Your preferences have been updated");
```

#### Error
```typescript
notify.error(title: string, description?: string, options?: NotificationOptions)
```
**Example:**
```typescript
notify.error("Failed to save", "Please check your internet connection");
```

#### Info
```typescript
notify.info(title: string, description?: string, options?: NotificationOptions)
```
**Example:**
```typescript
notify.info("Feature disabled", "This feature is not available in your region");
```

#### Warning
```typescript
notify.warning(title: string, description?: string, options?: NotificationOptions)
```
**Example:**
```typescript
notify.warning("Session expiring", "Your session will expire in 5 minutes");
```

### Authentication Notifications

All authentication notifications are pre-configured with appropriate messages:

```typescript
// Login
notify.auth.loginSuccess();
notify.auth.loginError(message?: string);

// Signup
notify.auth.signupSuccess();
notify.auth.signupError(message?: string);

// Logout
notify.auth.logoutSuccess();

// Password Reset
notify.auth.resetPasswordEmailSent();
notify.auth.resetPasswordEmailError(message?: string);
notify.auth.passwordUpdateSuccess();
notify.auth.passwordUpdateError(message?: string);

// Rate Limiting
notify.auth.rateLimitExceeded(seconds: number);
```

**Example:**
```typescript
const { error } = await signIn(email, password);
if (error) {
  notify.auth.loginError(error.message);
} else {
  notify.auth.loginSuccess();
}
```

### Network Notifications

```typescript
// Offline
notify.network.offline();

// Server Error
notify.network.serverError();

// Timeout
notify.network.timeout();
```

**Example:**
```typescript
try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Server error');
} catch (error) {
  if (error instanceof TypeError) {
    notify.network.offline();
  } else {
    notify.network.serverError();
  }
}
```

## Notification Options

```typescript
interface NotificationOptions {
  duration?: number;        // Duration in milliseconds (default: varies by type)
  action?: {
    label: string;         // Button label
    onClick: () => void;   // Button click handler
  };
}
```

**Example with custom duration:**
```typescript
notify.success("Saved", "Changes saved", { duration: 2000 });
```

**Example with action button:**
```typescript
notify.error("Failed to load data", "Click retry to try again", {
  duration: 5000,
  action: {
    label: "Retry",
    onClick: () => loadData()
  }
});
```

## Default Durations

- Success: 4 seconds
- Error: 5 seconds
- Info: 4 seconds
- Warning: 4 seconds
- Auth notifications: 3-5 seconds
- Network notifications: 5 seconds

## Best Practices

### DO ✅
- Use the centralized notification system for all user feedback
- Provide clear, actionable messages
- Use appropriate notification types
- Keep messages concise (1-2 short sentences)
- Include helpful context in descriptions
- Use action buttons for recoverable errors

### DON'T ❌
- Don't use multiple toast libraries
- Don't show sensitive information in notifications
- Don't use overly technical error messages
- Don't spam users with too many notifications
- Don't use notifications for minor UI feedback (use inline messages instead)

## Examples

### Form Validation Error
```typescript
if (!email) {
  notify.error("Email required", "Please enter your email address");
  return;
}
```

### API Request Success
```typescript
const response = await updateProfile(data);
if (response.ok) {
  notify.success("Profile updated", "Your changes have been saved");
}
```

### Background Sync Error
```typescript
try {
  await syncData();
} catch (error) {
  notify.warning("Sync incomplete", "Some data couldn't be synced. We'll try again later");
}
```

### Progressive Action with Retry
```typescript
try {
  await deleteAccount();
  notify.success("Account deleted", "Your account has been permanently deleted");
} catch (error) {
  notify.error("Deletion failed", "Failed to delete account", {
    action: {
      label: "Try again",
      onClick: () => deleteAccount()
    }
  });
}
```

## Styling

The notification system uses Sonner's default styling with these characteristics:
- Consistent with the app's design system
- Automatically positioned (top-right on desktop, top on mobile)
- Responsive to screen size
- Accessible (ARIA attributes, keyboard navigation)
- Supports dark mode

## Accessibility

The notification system is fully accessible:
- Screen reader announcements
- Keyboard navigation (Tab to focus, Enter to activate)
- High contrast support
- Respects user's motion preferences
- Semantic HTML structure

## Migration from useToast

If you have existing code using `useToast`, migrate like this:

**Before:**
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Settings saved",
});
```

**After:**
```typescript
import { notify } from "@/lib/notifications";

notify.success("Success", "Settings saved");
```

## Browser Support

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 5+)
