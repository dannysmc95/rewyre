import { AbstractController } from '../abstract/controller';
import { AbstractModel } from '../abstract/model';
import { AbstractService } from '../abstract/service';
import { AbstractGuard } from '../abstract/guard';
import { AbstractProvider } from '../abstract/provider';
import { IDatabaseDriver } from '../interface/database-driver';

export type FrameworkModules = AbstractController | AbstractModel | AbstractService | AbstractGuard | AbstractProvider | IDatabaseDriver;
export type HookTypes = 'init' | 'register' | 'start' | 'http' | 'ws' | 'service';
