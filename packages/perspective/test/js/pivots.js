/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */

var data = [
    {'x': 1, 'y':'a', 'z': true},
    {'x': 2, 'y':'b', 'z': false},
    {'x': 3, 'y':'c', 'z': true},
    {'x': 4, 'y':'d', 'z': false}
];

var meta = {
    'x': "integer",
    'y': "string",
    'z': "boolean"
};

module.exports = (perspective) => {

    describe("Aggregate", function() {

        it("['z'], sum", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['z'],
                aggregate: [{op: 'sum', column:'x'}],
            });
            var answer =  [
                {__ROW_PATH__: [], x: 10},
                {__ROW_PATH__: [ false ], x: 6},
                {__ROW_PATH__: [ true ], x: 4},
            ];
            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });

        it("['z'], mean", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['z'],
                aggregate: [{op: 'mean', column:'x'}],
            });
            var answer =  [
                {__ROW_PATH__: [], x: 2.5},
                {__ROW_PATH__: [ false ], x: 3},
                {__ROW_PATH__: [ true ], x: 2},
            ];
            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });
    });

    describe("Row pivot", function() {

        it("['x']", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x']
            });
            var answer =  [
                {__ROW_PATH__: [], x: 4, y: 4, z: 2},
                {__ROW_PATH__: [ 1 ], x: 1, y: 1, z: 1},
                {__ROW_PATH__: [ 2 ], x: 1, y: 1, z: 1},
                {__ROW_PATH__: [ 3 ], x: 1, y: 1, z: 1},
                {__ROW_PATH__: [ 4 ], x: 1, y: 1, z: 1}
            ];
            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });

        it("['x'] has a schema", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x']
            });
            let result2 = await view.schema();
            expect(result2).toEqual(meta);
        });

        it("['x'] has the correct # of rows", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x']
            });
            let result2 = await view.num_rows();
            expect(result2).toEqual(5);
        });

        it("['x'] has the correct # of columns", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x']
            });
            let result2 = await view.num_columns();
            expect(result2).toEqual(3);
        });

        it("['z']", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['z']
            });
            var answer =  [
                {__ROW_PATH__: [], x: 4, y: 4, z: 2},
                {__ROW_PATH__: [ false ], x: 2, y: 2, z: 1},
                {__ROW_PATH__: [ true ], x: 2, y: 2, z: 1},
            ];
            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });

        it("['x', 'z']", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x', 'z']
            });

            var answer = [
                { __ROW_PATH__: [], x: 4, y: 4, z: 2},
                { __ROW_PATH__: [ 1 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 1, true ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 2 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 2, false ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 3 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 3, true ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 4 ], x: 1, y: 1, z: 1 },
                { __ROW_PATH__: [ 4, false ], x: 1, y: 1, z: 1}
            ];

            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });


        it("['x', 'z'] windowed", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x', 'z']
            });

            var answer = [
                { __ROW_PATH__: [ 1, true ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 2 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 2, false ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 3 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 3, true ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 4 ], x: 1, y: 1, z: 1 },
                { __ROW_PATH__: [ 4, false ], x: 1, y: 1, z: 1}
            ];

            let result2 = await view.to_json({start_row: 2});
            expect(answer).toEqual(result2);
        });

        it("['x', 'z'], pivot_depth = 1", async function () {
            var table = perspective.table(data);
            var view = table.view({
                row_pivot: ['x', 'z'],
                row_pivot_depth: 1
            });

            var answer = [
                { __ROW_PATH__: [], x: 4, y: 4, z: 2},
                { __ROW_PATH__: [ 1 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 2 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 3 ], x: 1, y: 1, z: 1},
                { __ROW_PATH__: [ 4 ], x: 1, y: 1, z: 1 },
            ];

            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });

    });

    describe("Column pivot", function() {

        it("['x']", async function () {
            var table = perspective.table(data);
            var view = table.view({
                column_pivot: ['y'],
                row_pivot: ['x']
            });
            var answer =  [
                {"__ROW_PATH__":[],"a,x":1,"a,y":1,"a,z":1,"b,x":1,"b,y":1,"b,z":1,"c,x":1,"c,y":1,"c,z":1,"d,x":1,"d,y":1,"d,z":1},
                {"__ROW_PATH__":[1],"a,x":1,"a,y":1,"a,z":1,"b,x":null,"b,y":null,"b,z":null,"c,x":null,"c,y":null,"c,z":null,"d,x":null,"d,y":null,"d,z":null},
                {"__ROW_PATH__":[2],"a,x":null,"a,y":null,"a,z":null,"b,x":1,"b,y":1,"b,z":1,"c,x":null,"c,y":null,"c,z":null,"d,x":null,"d,y":null,"d,z":null},
                {"__ROW_PATH__":[3],"a,x":null,"a,y":null,"a,z":null,"b,x":null,"b,y":null,"b,z":null,"c,x":1,"c,y":1,"c,z":1,"d,x":null,"d,y":null,"d,z":null},
                {"__ROW_PATH__":[4],"a,x":null,"a,y":null,"a,z":null,"b,x":null,"b,y":null,"b,z":null,"c,x":null,"c,y":null,"c,z":null,"d,x":1,"d,y":1,"d,z":1}
            ];
            let result2 = await view.to_json();
            expect(answer).toEqual(result2);
        });

    });

};

