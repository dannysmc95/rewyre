import 'reflect-metadata';
import './module/internal';

import { ObjectID as ModelRecordID } from 'mongodb';

import { Controller } from './decorator/controller';
import { Route } from './decorator/route';
import { Model } from './decorator/model';
import { InjectModel } from './decorator/inject-model';
import { Authenticated } from './decorator/authenticated';

import { AbstractModel } from './abstract/model';
import { AbstractController } from './abstract/controller';

import { IContext } from './interface/context';
import { IModelDefinition } from './interface/model-definition';
import { IModelField } from './interface/model-field';
import { IModelQuery } from './interface/model-query';
import { IOptions } from './interface/options';
import { IRecord } from './interface/record';
import { IReturn } from './interface/return';
import { IRoute } from './interface/route';
import { IValidateResponse } from './interface/validate-response';

import { Server } from './module/server';

export {

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
	IContext,
	IModelDefinition,
	IModelField,
	IModelQuery,
	IOptions,
	IRecord,
	IReturn,
	IRoute,
	IValidateResponse,

	// Modules
	Server,
	ModelRecordID,
}