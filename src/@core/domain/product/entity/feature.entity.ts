import { ResetWindow } from "@domain/product/constants/reset-window.constant";
import { FeatureKey } from "@domain/product/constants/feature-keys.constant";
import { BackendCode } from "@domain/@shared/constants/backend-code.constant";
import { AppException } from "@domain/@shared/exceptions/app.exception";
import { CreateFeatureInput } from "@domain/product/types/feature.type";

export class Feature {
    id: number;
    name: string;
    key: FeatureKey;
    hidden: boolean;
    isActive: boolean;
    hasQuota: boolean;
    quota: number;
    resetWindow: ResetWindow;

    constructor(data: CreateFeatureInput) {
        this.name = data.name;
        this.key = data.key;
        this.hidden = data.hidden ?? true;
        this.isActive = data.isActive ?? false;
        this.hasQuota = data.hasQuota ?? false;
        this.quota = data.quota ?? -1;
        this.resetWindow = data.resetWindow;

        this.validate();
    }

    validate(): void {
        if (!this.name || this.name.trim() === "")
            throw new AppException(BackendCode.featureNameEmpty, 400);

        if (!this.key || this.key.trim() === "")
            throw new AppException(BackendCode.featureKeyEmpty, 400);
    }

    activate(): void {
        this.isActive = true;
    }

    deactivate(): void {
        this.isActive = false;
    }

    toggleVisibility(): void {
        this.hidden = !this.hidden;
    }

    setUnlimitedQuota(): void {
        this.hasQuota = false;
        this.quota = -1;
    }

}