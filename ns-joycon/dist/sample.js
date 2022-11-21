"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Local modules.
const JoyCon = __importStar(require("./index"));
JoyCon.findControllers((devices) => {
    // When found any device.
    devices.forEach((device) => __awaiter(this, void 0, void 0, function* () {
        console.log(`Found a device (${device.meta.serialNumber})`);
        // Add a handler for new device.
        device.manageHandler('add', (packet) => {
            console.log(device.meta.product, packet);
        });
        // const deviceInfo = await device.requestDeviceInfo();
        yield device.enableIMU();
        // await device.disableIMU();
        // await device.enableVibration();
        // await device.disableVibration();
    }));
});
//# sourceMappingURL=sample.js.map