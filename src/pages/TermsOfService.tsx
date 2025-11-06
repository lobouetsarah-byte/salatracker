import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const TermsOfService = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === "fr" ? "Retour" : "Back"}
        </Button>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">
              {language === "fr" ? "Conditions Générales de Vente" : "Terms of Service"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            {language === "fr" ? (
              <>
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Acceptation des conditions</h2>
                  <p className="text-muted-foreground">
                    En utilisant Salatracker, vous acceptez ces conditions générales de vente. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Description du service</h2>
                  <p className="text-muted-foreground">
                    Salatracker est une application mobile qui vous aide à suivre vos prières quotidiennes et vos invocations. L'application fournit des horaires de prière, des rappels et des statistiques personnelles.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Compte utilisateur</h2>
                  <p className="text-muted-foreground">
                    Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe. Vous acceptez de nous informer immédiatement de toute utilisation non autorisée de votre compte.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Utilisation acceptable</h2>
                  <p className="text-muted-foreground">
                    Vous acceptez d'utiliser l'application uniquement à des fins légales et conformément à ces conditions. Vous ne devez pas utiliser l'application d'une manière qui pourrait endommager, désactiver ou altérer le service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Propriété intellectuelle</h2>
                  <p className="text-muted-foreground">
                    Tous les droits de propriété intellectuelle relatifs à l'application et à son contenu appartiennent à Salatracker. Vous n'avez pas le droit de copier, modifier ou distribuer notre contenu sans autorisation.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Limitation de responsabilité</h2>
                  <p className="text-muted-foreground">
                    Salatracker ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser l'application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Modifications des conditions</h2>
                  <p className="text-muted-foreground">
                    Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur dès leur publication dans l'application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question concernant ces conditions, veuillez nous contacter via les paramètres de l'application.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By using Salatracker, you accept these terms of service. If you do not accept these terms, please do not use our application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
                  <p className="text-muted-foreground">
                    Salatracker is a mobile application that helps you track your daily prayers and supplications. The app provides prayer times, reminders, and personal statistics.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. User Account</h2>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                  <p className="text-muted-foreground">
                    You agree to use the application only for lawful purposes and in accordance with these terms. You must not use the application in any way that could damage, disable, or impair the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All intellectual property rights relating to the application and its content belong to Salatracker. You do not have the right to copy, modify, or distribute our content without permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    Salatracker will not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Changes will take effect as soon as they are published in the application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                  <p className="text-muted-foreground">
                    For any questions regarding these terms, please contact us via the application settings.
                  </p>
                </section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
