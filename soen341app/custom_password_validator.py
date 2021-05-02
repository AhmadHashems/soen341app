from django.core.exceptions import ValidationError


class CustomPasswordValidator:
    def validate(self, password, user=None):
        errors = []
        if not any(char.isdigit() for char in password):
            errors.append('Password must contain at least 1 digit.')
        if not any(char.isalpha() for char in password):
            errors.append('Password must contain at least 1 letter.')
        if not any(char.isupper() for char in password):
            errors.append('Password must contain at least 1 uppercase letter.')
        if user == password:
            errors.append('Your password cannot be too similar to your username.')
        if len(errors) > 0:
            raise ValidationError(errors)

    def get_help_text(self):
        return "Yor password must contain at least 1 digit, 1 letter, 1 uppercase letter."
