import { Request } from 'express';
import { Guard, AbstractGuard, IGuard } from '../../src/index';

@Guard('default', true)
export class DefaultGuard extends AbstractGuard implements IGuard {}