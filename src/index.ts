import 'reflect-metadata';

import { AbstractController } from './abstract/controller';
import { AbstractModel } from './abstract/model';
import { AbstractProvider } from './abstract/provider';
import { AbstractService } from './abstract/service';

import { Controller } from './decorator/controller';
import { Inject } from './decorator/inject';
import { Model } from './decorator/model';
import { Provide } from './decorator/provide';
import { Route } from './decorator/route';
import { Service } from './decorator/service';
import { Threaded } from './decorator/threaded';

import { ErrorMessages } from './enum/error-messages';

import { FrameworkHelper } from './helper/framework';
import { PacketHelper } from './helper/packet';
import { ServerHelper } from './helper/server';

import { IAny } from './interface/any';
import { IContext, IContextRaw } from './interface/context';
import { IOptions } from './interface/options';
import { IPacket } from './interface/packet';
import { IRecord } from './interface/record';
import { IReturn } from './interface/return';
import { IValidateResponse } from './interface/validate-response';

import { Database } from './module/database';
import { Framework } from './module/framework';
import { HTTPServer } from './module/http-server';
import { Logger } from './module/logger';
import { Router } from './module/router';
import { Threader } from './module/threader';
import { WSServer } from './module/ws-server';

/**
 * The default entry into the rewyre library, everything is
 * exported from this area, and ALL classes, interfaces, enums
 * and more is exported so that you can even augment and extend
 * the classes to add even more functionality or additionally
 * build your own framework based on this.
 */
export {

	// Abstract.
	AbstractController,
	AbstractModel,
	AbstractProvider,
	AbstractService,

	// Decorator.
	Controller,
	Inject,
	Model,
	Provide,
	Route,
	Service,
	Threaded,

	// Enum.
	ErrorMessages,

	// Helper.
	FrameworkHelper,
	PacketHelper,
	ServerHelper,

	// Interface.
	IAny,
	IContext,
	IContextRaw,
	IOptions,
	IPacket,
	IRecord,
	IReturn,
	IValidateResponse,

	// Module.
	Database,
	Framework,
	HTTPServer,
	Logger,
	Router,
	Threader,
	WSServer,
};