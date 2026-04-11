import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";

describe("AppController", () => {
    let appController: AppController;

    beforeEach(() => {
        appController = new AppController(new AppService());
    });

    describe("root", () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe("Hello World!");
        });
    });
});
