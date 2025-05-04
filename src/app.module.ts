import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SalaryModule } from './salary/salary.module';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

const yamlConfigLoader = () => {
  try {
    const configPath = join(process.cwd(), 'config', 'default.yml');
    const fileContents = readFileSync(configPath, 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const config = load(fileContents) as Record<string, any>;
    return config;
  } catch (error) {
    console.error('Error loading config file:', error);
    return {};
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [yamlConfigLoader],
      cache: true,
    }),
    SalaryModule,
  ],
})
export class AppModule {}
