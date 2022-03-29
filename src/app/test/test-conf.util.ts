
import * as data from '../config/test-config.json';
import * as prod from '../config/config.json';

import { TestConfigModel } from './test-config.model';
import { ConfigModel } from '../models/config.model';

export class TestConfUtil {
    public getConfigData(): TestConfigModel {
        let configuredData: TestConfigModel = (data as any).default as TestConfigModel;
        return configuredData;
    }
    public getProdConfigData(): ConfigModel {
        let configuredData: ConfigModel = (prod as any).default as ConfigModel;
        return configuredData;
    }
}