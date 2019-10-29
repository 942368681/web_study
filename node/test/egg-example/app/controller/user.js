'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
    async index() {
        const { ctx } = this;

        // ctx.body = [
        //     {name: 'sfl'},
        //     {name: 'yxy'}
        // ];

        ctx.body = await ctx.service.user.getAll();
    }
}

module.exports = HomeController;
