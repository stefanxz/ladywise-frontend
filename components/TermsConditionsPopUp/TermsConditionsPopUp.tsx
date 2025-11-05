import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onAccept: (version: string) => void;
  onClose: () => void;
};

export default function TermsConditionsPopUp({
  visible,
  onAccept,
  onClose,
}: Props) {
  // Terms and conditions version
  const TERMS_VERSION = "v1.0";
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="h-[85%] bg-white rounded-t-2xl px-5 pt-3 pb-6">
          <View className="self-center w-12 h-1.5 rounded bg-gray-200 mb-2" />
          <Text className="text-3xl text-brand text-left font-semibold">
            Privacy Policy &{"\n"}Terms of Service
          </Text>
          <View className="h-2" />

          <ScrollView>
            <View className="pb-3 flex-1">
              <Text className="text-gray-600 text-base leading-snug mt-2 text-left">
                At LifeSense Group, we believe that wearable technology empowers
                people to understand and work on their health independently. We
                fully acknowledge the great responsibility that comes with
                safeguarding sensitive data, such as information about your
                menstruation and blood conductivity. We are committed to
                achieving the highest standards of privacy and security, as well
                as to being transparent about how we process data. We hope you
                will find this privacy policy clear, honest, and transparent. Do
                not hesitate to reach out to us at info@lifesense-group.com if
                you have any questions. LifeSense Group contact address is High
                Tech Campus 10, 5656 AE, Eindhoven, The Netherlands. Further
                contact information can be found here. LifeSense Group has an
                appointed data protection officer, who can be contacted at
                info@lifesense-group.com.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                1. How we process your personal data at LifeSense Group
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                Data processing is at the center of everything we do at
                LifeSense Group. Whenever you use our services—such as LifeSense
                Group products and apps (like Oopsie Heroes or Carin Pelvic
                Floor Trainer) or when you go on our website—some personal and
                non-personal data is collected, stored, and analyzed using
                internal and third-party tools. Here are the three purposes for
                which we process data and the type of data that is processed to
                fulfill each purpose:
              </Text>

              <Text className="text-gray-600 text-base leading-snug mt-2">
                1.1 To understand your needs and improve our services
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                When you use our apps—including use without an account—or when
                you go on our website, LifeSense Group collects, stores, and
                uses some personal and non-personal data and transmits it to
                some third-party services. We do this to understand your needs,
                analyze bugs, fix issues, and bring you useful features. We
                process this data to provide you with the best and most reliable
                experience. We do not process data that directly identifies you
                (such as your name or email) or health-related data.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Device data: Information about your device, model,
                identifiers, settings, application identifier, crash data,
                browser info, OS, and system settings.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Event and usage data: Which pages or app tabs you use, to
                understand usage patterns.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • IP address: Used to deliver the service and determine
                approximate location for analytics.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                All the data we collect is necessary for delivering our
                services, and we minimize collection wherever possible. If you
                disagree, we recommend you stop using our services or delete
                your account and uninstall the app.
              </Text>

              <Text className="text-gray-600 text-base leading-snug mt-2">
                1.2 To deliver personalized insights as your trusted health
                companion
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                The data you track in LifeSense Group apps about your health and
                activities is considered sensitive personal data. LifeSense
                Group only stores this data with your explicit consent (by
                creating an account). You can withdraw your consent at any time
                by deleting your account. Without an account, data is only
                stored locally on your device.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                Data collected when you create an account:
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Personal data: Name, surname, and email address.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Health and sensitive data: Age, gender, menstruation and blood
                conductivity data, used to provide services.
              </Text>

              <Text className="text-gray-600 text-base leading-snug mt-2">
                1.3 To advance scientific research about LadyWise
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                LifeSense Group collaborates with academic researchers but only
                provides anonymized data following strict protocols. You can
                withdraw consent for research use by deleting your account; your
                data will not be used in future research.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                2. Your consent for processing health and sensitive data
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                If you create an account, your personal and sensitive data is
                stored on your device and LifeSense Group servers to provide
                features and backups. By creating an account, you explicitly
                consent that:
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                1. LifeSense Group may store and process your data to provide
                and improve its services.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                2. Personal data includes your name, email, and possibly age or
                gender.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                3. LifeSense Group may use anonymized urine loss data for
                academic and clinical research with vetted collaborators. You
                may withdraw consent at any time by deleting your account.
                Without an account, data will no longer be backed up—make sure
                to back up your own data.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                3. Your rights
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                We believe data privacy is a basic human right. Key facts:
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                1. We minimize personal data usage.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                2. Our servers are routinely security-tested.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                3. We do not retain identifiable data longer than needed.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                4. We do not use automated decision-making or profiling.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                As a user, you may:
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Request information about your data.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Gain access or request a portable backup.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Correct your information in the app.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Withdraw consent by deleting your account or unsubscribing
                from newsletters.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Request deletion of your data (email info@lifesense-group.com;
                deletion within 30 days).
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Lodge a complaint with a data protection authority.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                4. Data Security
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                We apply security measures to prevent misuse, loss, or
                alteration of your personal information. We use industry best
                practices but cannot guarantee absolute security.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                4.1 How LifeSense Group stores your personal data
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                Account data is stored separately from tracking data for
                privacy. Passwords are stored using one-way encryption (hashing
                + salting). Important: Data is stored on EU servers and
                transmitted via HTTPS encryption.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                4.2 Recommendations for protecting your data
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                Biggest threat: unauthorized access to your device.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Protect your device with PIN, TouchID, or FaceID.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • Enable “Find My iPhone” or “Find My Device” and “Erase your
                device” for lost/stolen phones.
              </Text>
              <Text className="pl-4 mt-1 text-gray-600 text-base leading-snug">
                • If you don’t have an account, all your data stays on your
                device. Back it up regularly via iTunes or iCloud.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                5. Data transfer outside the EU and to third-party applications
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                Any personal data transferred outside the EU/EEA will comply
                with applicable privacy laws and ensure protection of your
                rights.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                6. Cookies and tracking
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                Our website uses cookies for functionality, analytics, and
                preferences. You can disable cookies in your browser. We also
                use third-party tracking (e.g., Google Analytics) to improve
                performance. Data is anonymized when no longer needed.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                6.1 Your consent for tracking and analysis
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                By using our apps or website, you consent to cookies and
                tracking. You can withdraw consent anytime by disabling cookies
                or opting out from each provider.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                6.2 Google Analytics
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                We use Google Analytics (Google Inc., USA) to analyze website
                usage. Google may transfer data to third parties when required
                by law. You can block cookies via your browser. By using our
                website, you consent to Google’s processing of non-personal
                data.
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                6.3 Google and other providers comply with the EU-US Privacy
                Shield Framework.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                7. Communications and newsletter activities
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                We may contact you by email, push notifications, or in-app
                messages if you consented to receive them. You can unsubscribe
                anytime via the unsubscribe link or by changing app settings. We
                use MailChimp (Rocket Science Group LLC, Atlanta, USA) to manage
                newsletters; this company complies with the EU-US Privacy Shield
                Framework.
              </Text>

              <View className="h-3" />

              <Text className="text-xl font-semibold text-brand mt-4">
                8. Changes to this Privacy Policy
              </Text>
              <Text className="text-gray-600 text-base leading-snug mt-2">
                We may amend this Privacy Policy from time to time. Check this
                page periodically for updates. If material changes occur, we
                will post a notice within this policy. If anything is unclear,
                contact us at info@lifesense-group.com. ©2025 LifeSense Group
                B.V. Idk if there is some nice way to format this or some sht,
                but I need all of this in the terms and conditions!
              </Text>
            </View>
          </ScrollView>

          <Pressable
            className="mt-4 bg-brand rounded-xl py-3 items-center"
            onPress={() => onAccept(TERMS_VERSION)}
          >
            <Text className="text-white font-semibold">Accept & Continue</Text>
          </Pressable>

          <Pressable className="mt-2 items-center py-2" onPress={onClose}>
            <Text className="text-brand font-semibold">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
