import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const PrivacyPolicy = () => {
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
              {language === "fr" ? "Politique de Confidentialité" : "Privacy Policy"}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            {language === "fr" ? (
              <>
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Collecte d'informations</h2>
                  <p className="text-muted-foreground">
                    Nous collectons les informations suivantes : votre prénom, adresse email, vos objectifs spirituels, et vos données d'utilisation de l'application (prières accomplies, invocations effectuées).
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Utilisation des informations</h2>
                  <p className="text-muted-foreground">
                    Les informations collectées sont utilisées pour :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>Fournir et personnaliser nos services</li>
                    <li>Envoyer des notifications de rappel pour les prières</li>
                    <li>Améliorer votre expérience utilisateur</li>
                    <li>Analyser l'utilisation de l'application</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Protection des données</h2>
                  <p className="text-muted-foreground">
                    Nous prenons la sécurité de vos données très au sérieux. Vos informations sont stockées de manière sécurisée et chiffrées. Nous n'accédons à vos données personnelles que dans les cas strictement nécessaires à la fourniture du service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Partage des données</h2>
                  <p className="text-muted-foreground">
                    Nous ne vendons ni ne louons vos informations personnelles à des tiers. Vos données peuvent être partagées uniquement dans les cas suivants :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>Avec votre consentement explicite</li>
                    <li>Pour se conformer à la loi ou à une procédure judiciaire</li>
                    <li>Pour protéger nos droits, notre propriété ou notre sécurité</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Cookies et technologies similaires</h2>
                  <p className="text-muted-foreground">
                    Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, analyser l'utilisation de l'application et personnaliser le contenu.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Vos droits</h2>
                  <p className="text-muted-foreground">
                    Vous avez le droit de :
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>Accéder à vos données personnelles</li>
                    <li>Corriger ou mettre à jour vos informations</li>
                    <li>Supprimer votre compte et vos données</li>
                    <li>Retirer votre consentement à tout moment</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Localisation</h2>
                  <p className="text-muted-foreground">
                    L'application utilise votre localisation uniquement pour déterminer les horaires de prière précis pour votre zone géographique. Ces données ne sont pas stockées ni partagées.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Modifications de la politique</h2>
                  <p className="text-muted-foreground">
                    Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle politique dans l'application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
                  <p className="text-muted-foreground">
                    Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez nous contacter via les paramètres de l'application.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Information Collection</h2>
                  <p className="text-muted-foreground">
                    We collect the following information: your first name, email address, spiritual goals, and your app usage data (prayers completed, supplications performed).
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Use of Information</h2>
                  <p className="text-muted-foreground">
                    The collected information is used to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>Provide and personalize our services</li>
                    <li>Send prayer reminder notifications</li>
                    <li>Improve your user experience</li>
                    <li>Analyze application usage</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Data Protection</h2>
                  <p className="text-muted-foreground">
                    We take the security of your data very seriously. Your information is stored securely and encrypted. We only access your personal data when strictly necessary to provide the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell or rent your personal information to third parties. Your data may only be shared in the following cases:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>With your explicit consent</li>
                    <li>To comply with the law or legal proceedings</li>
                    <li>To protect our rights, property, or safety</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Cookies and Similar Technologies</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to improve your experience, analyze application usage, and personalize content.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                  <p className="text-muted-foreground">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>Access your personal data</li>
                    <li>Correct or update your information</li>
                    <li>Delete your account and data</li>
                    <li>Withdraw your consent at any time</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Location</h2>
                  <p className="text-muted-foreground">
                    The application uses your location only to determine accurate prayer times for your geographic area. This data is not stored or shared.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Policy Changes</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy in the application.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
                  <p className="text-muted-foreground">
                    For any questions regarding this privacy policy or to exercise your rights, please contact us via the application settings.
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

export default PrivacyPolicy;
