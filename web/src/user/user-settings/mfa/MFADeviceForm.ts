import { DEFAULT_CONFIG } from "@goauthentik/common/api/config";
import "@goauthentik/elements/forms/HorizontalFormElement";
import { ModelForm } from "@goauthentik/elements/forms/ModelForm";

import { t } from "@lingui/macro";

import { TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { AuthenticatorsApi, Device } from "@goauthentik/api";

@customElement("ak-user-mfa-form")
export class MFADeviceForm extends ModelForm<Device, number> {
    @property()
    deviceType!: string;

    loadInstance(pk: number): Promise<Device> {
        return new AuthenticatorsApi(DEFAULT_CONFIG).authenticatorsAllList().then((devices) => {
            return devices.filter((device) => {
                return device.pk === pk && device.type === this.deviceType;
            })[0];
        });
    }

    getSuccessMessage(): string {
        return t`Successfully updated device.`;
    }

    send = async (device: Device): Promise<Device> => {
        switch (this.instance?.type) {
            case "authentik_stages_authenticator_duo.DuoDevice":
                await new AuthenticatorsApi(DEFAULT_CONFIG).authenticatorsDuoUpdate({
                    id: this.instance?.pk,
                    duoDeviceRequest: device,
                });
                break;
            case "authentik_stages_authenticator_sms.SMSDevice":
                await new AuthenticatorsApi(DEFAULT_CONFIG).authenticatorsSmsUpdate({
                    id: this.instance?.pk,
                    sMSDeviceRequest: device,
                });
                break;
            case "otp_totp.TOTPDevice":
                await new AuthenticatorsApi(DEFAULT_CONFIG).authenticatorsTotpUpdate({
                    id: this.instance?.pk,
                    tOTPDeviceRequest: device,
                });
                break;
            case "otp_static.StaticDevice":
                await new AuthenticatorsApi(DEFAULT_CONFIG).authenticatorsStaticUpdate({
                    id: this.instance?.pk,
                    staticDeviceRequest: device,
                });
                break;
            case "authentik_stages_authenticator_webauthn.WebAuthnDevice":
                await new AuthenticatorsApi(DEFAULT_CONFIG).authenticatorsWebauthnUpdate({
                    id: this.instance?.pk,
                    webAuthnDeviceRequest: device,
                });
                break;
            default:
                break;
        }
        return device;
    };

    renderForm(): TemplateResult {
        return html`<form class="pf-c-form pf-m-horizontal">
            <ak-form-element-horizontal label=${t`Name`} ?required=${true} name="name">
                <input
                    type="text"
                    value="${ifDefined(this.instance?.name)}"
                    class="pf-c-form-control"
                    required
                />
            </ak-form-element-horizontal>
        </form>`;
    }
}
