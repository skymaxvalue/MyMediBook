// lib/models/saved_card.dart

class SavedCard {
  final String id;
  final String holderName;
  final String cardNumber; // raw digits e.g. "4111111111111234"
  final String expiry;     // "MM/YY"
  final String cvv;        // raw CVV digits
  final String cardType;   // "Visa" | "Mastercard" | "Amex" | "RuPay" | "Card"

  const SavedCard({
    required this.id,
    required this.holderName,
    required this.cardNumber,
    required this.expiry,
    required this.cvv,
    required this.cardType,
  });

  factory SavedCard.fromJson(Map<String, dynamic> json) => SavedCard(
        id:         json['id']         as String,
        holderName: json['holderName'] as String,
        cardNumber: json['cardNumber'] as String? ?? '',
        expiry:     json['expiry']     as String,
        cvv:        json['cvv']        as String? ?? '',
        cardType:   json['cardType']   as String,
      );

  /// Build from the `paymentData` block inside GetPatientProfileByProfileId.
  /// [profileId] is used as the stable unique id for deduplication.
  factory SavedCard.fromProfileApiJson(int profileId, Map<String, dynamic> pd) {
    final holder = pd['cardHolder'] as String? ?? '';
    final number = pd['cardNumber'] as String? ?? '';
    final expiry = pd['expiry']     as String? ?? '';
    // Infer card type from first digit of number
    String cardType = 'Card';
    if (number.startsWith('4'))      cardType = 'Visa';
    else if (number.startsWith('5')) cardType = 'Mastercard';
    else if (number.startsWith('3')) cardType = 'Amex';
    else if (number.startsWith('6')) cardType = 'RuPay';
    return SavedCard(
      id:         'PROFILE-CARD-$profileId',
      holderName: holder,
      cardNumber: number,
      expiry:     expiry,
      cvv:        '',
      cardType:   cardType,
    );
  }

  Map<String, dynamic> toJson() => {
        'id':         id,
        'holderName': holderName,
        'cardNumber': cardNumber,
        'expiry':     expiry,
        'cvv':        cvv,
        'cardType':   cardType,
      };

  /// Last 4 digits for display purposes only (e.g. in the card picker tile)
  String get last4 => cardNumber.length >= 4
      ? cardNumber.substring(cardNumber.length - 4)
      : cardNumber;
}