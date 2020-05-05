from .stripe import Stripe
from .mailchimp import Mailchimp


all_integrations = {
    "stripe": Stripe,
    "mailchimp": Mailchimp,
}
