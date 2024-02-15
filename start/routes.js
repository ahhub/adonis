"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("questions", "QuestionController.index");
Route.post("questions", "QuestionController.store");
Route.get("questions/:id", "QuestionController.show");
Route.put("questions/:id", "QuestionController.update");
Route.post("questions/compare/:id", "QuestionController.compare");
Route.delete("questions/:id", "QuestionController.destroy");
