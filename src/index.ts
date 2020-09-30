import 'reflect-metadata';

import { ObjectID as ModelRecordID } from 'mongodb';

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

import { ErrorMessages } from './enum/error-messages';

import { FrameworkHelper } from './helper/framework';
import { ServerHelper } from './helper/server';

import { IContext, IContextRaw } from './interface/context';
import { IOptions } from './interface/options';
import { IReturn } from './interface/return';
import { IService } from './interface/service';
import { IValidateResponse } from './interface/validate-response';

import { Database } from './module/database';
import { Framework } from './module/framework';
import { HTTPServer } from './module/http-server';
import { Logger } from './module/logger';
import { Router } from './module/router';
import { Scheduler } from './module/scheduler';
import { State } from './module/state';
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

	// Enum.
	ErrorMessages,

	// Helper.
	FrameworkHelper,
	ServerHelper,

	// Interface.
	IContext,
	IContextRaw,
	IOptions,
	IReturn,
	IService,
	IValidateResponse,

	// Module.
	Database,
	Framework,
	HTTPServer,
	Logger,
	Router,
	Scheduler,
	State,
	WSServer,

	// External.
	ModelRecordID,
};