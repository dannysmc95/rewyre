import 'reflect-metadata';
import './module/internal';

import { ObjectID as ModelRecordID } from 'mongodb';

import { Packet } from './helper/packet';
import { WSHelper } from './helper/ws-helper';

import { Controller } from './decorator/controller';
import { Route } from './decorator/route';
import { Model } from './decorator/model';
import { InjectModel } from './decorator/inject-model';
import { Authenticated } from './decorator/authenticated';

import { AbstractModel } from './abstract/model';
import { AbstractController } from './abstract/controller';

import { IAny } from './interface/any';
import { IContext } from './interface/context';
import { IModelDefinition } from './interface/model-definition';
import { IModelField } from './interface/model-field';
import { IModelQuery } from './interface/model-query';
import { IOptions } from './interface/options';
import { IPacket } from './interface/packet';
import { IRecord } from './interface/record';
import { IReturn } from './interface/return';
import { IRoute } from './interface/route';
import { IValidateResponse } from './interface/validate-response';

import { Errors } from './enum/errors';

import { Server } from './module/server';
import { WSServer } from './module/ws-server';

/**
 * The rewyre export, that exports all interfaces, classes, and more.
 */
export {

	// External
	ModelRecordID,

	// Helpers
	Packet,
	WSHelper,

	// Decorators
	Controller,
	Route,
	Model,
	InjectModel,
	Authenticated,

	// Abstract Classes
	AbstractModel,
	AbstractController,

	// Interfaces
	IAny,
	IContext,
	IModelDefinition,
	IModelField,
	IModelQuery,
	IOptions,
	IPacket,
	IRecord,
	IReturn,
	IRoute,
	IValidateResponse,

	// Enums
	Errors,

	// Modules
	Server,
	WSServer,
}