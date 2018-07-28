import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

class Config {
  private readonly envConfig: { [prop: string]: string };

  constructor() {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const configPath = path.join(__dirname, `${NODE_ENV}.env`);
    this.envConfig = dotenv.parse(fs.readFileSync(configPath));
  }

  get(key: string): string {
    return process.env[key] || this.envConfig[key];
  }
}
export default new Config();