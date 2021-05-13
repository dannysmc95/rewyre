import 'reflect-metadata';

import { ObjectID as ModelRecordID } from 'mongodb';

import { AbstractController } from './abstract/controller';
import { AbstractGuard } from './abstract/guard';
import { AbstractModel } from './abstract/model';
import { AbstractProvider } from './abstract/provider';
import { AbstractService } from './abstract/service';

import { Catch } from './decorator/catch';
import { Controller } from './decorator/controller';
import { Guard } from './decorator/guard';
import { Inject } from './decorator/inject';
import { Model } from './decorator/model';
import { Provide } from './decorator/provide';
import { Route } from './decorator/route';
import { Service } from './decorator/service';

import { DatabaseDriverMongo } from './driver/database-mongo';
import { DatabaseDriverMysql } from './driver/database-mysql';

import { Drivers } from './enum/drivers';
import { ErrorMessages } from './enum/error-messages';

import { FrameworkHelper } from './helper/framework';
import { ServerHelper } from './helper/server';

import { IContext, IContextRaw } from './interface/context';
import { IDatabaseDriver } from './interface/database-driver';
import { IDriver } from './interface/driver';
import { IGuard } from './interface/guard';
import { IOptions } from './interface/options';
import { IReturn } from './interface/return';
import { IService } from './interface/service';
import { IValidateResponse } from './interface/validate-response';

import { Authenticator } from './module/authenticator';
import { Database } from './module/database';
import { Framework } from './module/framework';
import { HTTPServer } from './module/http-server';
import { Logger } from './module/logger';
import { Router } from './module/router';
import { Scheduler } from './module/scheduler';
import { State } from './module/state';
import { WSServer } from './module/ws-server';

import { CryptoProvider } from './provider/crypto';

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
	AbstractGuard,
	AbstractModel,
	AbstractProvider,
	AbstractService,

	// Decorator.
	Controller,
	Guard,
	Inject,
	Model,
	Provide,
	Route,
	Service,
	Catch,

	// Driver.
	DatabaseDriverMongo,
	DatabaseDriverMysql,

	// Enum.
	Drivers,
	ErrorMessages,

	// Helper.
	FrameworkHelper,
	ServerHelper,

	// Interface.
	IContext,
	IContextRaw,
	IDatabaseDriver,
	IDriver,
	IGuard,
	IOptions,
	IReturn,
	IService,
	IValidateResponse,

	// Module.
	Authenticator,
	Database,
	Framework,
	HTTPServer,
	Logger,
	Router,
	Scheduler,
	State,
	WSServer,

	// Provider.
	CryptoProvider,

	// External.
	ModelRecordID,
};
