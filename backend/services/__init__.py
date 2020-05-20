from .stripe import Stripe
from .mailchimp import Mailchimp


all_services = {
    "stripe": Stripe,
    "mailchimp": Mailchimp,
}
