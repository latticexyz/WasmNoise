var WasmNoise = WasmNoise || { loaded: false };
WasmNoise.memory = WasmNoise.memory || new WebAssembly.Memory({initial: 9});
WasmNoise.Interp = WasmNoise.Interp || Object.freeze({Linear: 0, Hermite: 1, Quintic: 2});
WasmNoise.FractalType = WasmNoise.FractalType || Object.freeze({FBM: 0, Billow: 1, RidgedMulti: 2});
WasmNoise.StripDirection = WasmNoise.StripDirection || Object.freeze({XAxis: 0, YAxis: 1, ZAxis: 2, WAxis: 3});
WasmNoise.SquarePlane = WasmNoise.SquarePlane || Object.freeze({XYPlane: 0, XZPlane: 1, ZYPlane: 2, XWPlane: 3, YWPlane: 4, ZWPlane: 5});
WasmNoise.CellularDistanceFunction = WasmNoise.CellularDistanceFunction || Object.freeze({Euclidean: 0, Manhattan: 1, Natural: 2});
WasmNoise.CellularReturnType = WasmNoise.CellularReturnType || Object.freeze({CellValue: 0, Distance: 1, Distance2: 2, Distance2Add: 3, Distance2Sub: 4, Distance2Mul: 5, Distance2Div: 6, NoiseLookupPerlin: 7, NoiseLookupSimplex: 8});
WasmNoise.fetchCompileAndInstantiate = WasmNoise.fetchCompileAndInstantiate || function(){return fetch('./wasmnoise-0.4.3.opt.wasm').then(res => {if(res.ok){return res.arrayBuffer();}else{throw new Error('Unable to fetch WasmNoise!');}}).then(bytes => WebAssembly.compile(bytes)).then(wasmnoiseModule => {return WebAssembly.instantiate(wasmnoiseModule, {env: {__errno_location:function() { return 8; },abort: function() { throw new Error('Abort called!'); },sbrk: function(len) { return (WasmNoise.memory.grow(len >> 16) << 16); },memory: this.memory}})}).then(instance => {
this.instance = instance;
this.instance.exports['_GLOBAL__sub_I_WasmNoiseInterface.cpp']();
this.SetSeed = this.instance.exports.SetSeed;
this.GetSeed = this.instance.exports.GetSeed;
this.SetFrequency = this.instance.exports.SetFrequency;
this.GetFrequency = this.instance.exports.GetFrequency;
this.SetInterp = this.instance.exports.SetInterp;
this.GetInterp = this.instance.exports.GetInterp;
this.SetFractalOctaves = this.instance.exports.SetFractalOctaves;
this.GetFractalOctaves = this.instance.exports.GetFractalOctaves;
this.SetFractalLacunarity = this.instance.exports.SetFractalLacunarity;
this.GetFractalLacunarity = this.instance.exports.GetFractalLacunarity;
this.SetFractalGain = this.instance.exports.SetFractalGain;
this.GetFractalGain = this.instance.exports.GetFractalGain;
this.SetFractalType = this.instance.exports.SetFractalType;
this.GetFractalType = this.instance.exports.GetFractalType;
this.GetPerlin2 = this.instance.exports.GetPerlin2;
this.GetPerlin2_Strip = this.instance.exports.GetPerlin2_Strip;
this.GetPerlin2_Square = this.instance.exports.GetPerlin2_Square;
this.GetPerlin3 = this.instance.exports.GetPerlin3;
this.GetPerlin3_Strip = this.instance.exports.GetPerlin3_Strip;
this.GetPerlin3_Square = this.instance.exports.GetPerlin3_Square;
this.GetPerlin3_Cube = this.instance.exports.GetPerlin3_Cube;
this.GetPerlinFractal2 = this.instance.exports.GetPerlinFractal2;
this.GetPerlinFractal2_Strip = this.instance.exports.GetPerlinFractal2_Strip;
this.GetPerlinFractal2_Square = this.instance.exports.GetPerlinFractal2_Square;
this.GetPerlinFractal3 = this.instance.exports.GetPerlinFractal3;
this.GetPerlinFractal3_Strip = this.instance.exports.GetPerlinFractal3_Strip;
this.GetPerlinFractal3_Square = this.instance.exports.GetPerlinFractal3_Square;
this.GetPerlinFractal3_Cube = this.instance.exports.GetPerlinFractal3_Cube;
this.GetSimplex2 = this.instance.exports.GetSimplex2;
this.GetSimplex2_Strip = this.instance.exports.GetSimplex2_Strip;
this.GetSimplex2_Square = this.instance.exports.GetSimplex2_Square;
this.GetSimplex3 = this.instance.exports.GetSimplex3;
this.GetSimplex3_Strip = this.instance.exports.GetSimplex3_Strip;
this.GetSimplex3_Square = this.instance.exports.GetSimplex3_Square;
this.GetSimplex3_Cube = this.instance.exports.GetSimplex3_Cube;
this.GetSimplex4 = this.instance.exports.GetSimplex4;
this.GetSimplex4_Strip = this.instance.exports.GetSimplex4_Strip;
this.GetSimplex4_Square = this.instance.exports.GetSimplex4_Square;
this.GetSimplex4_Cube = this.instance.exports.GetSimplex4_Cube;
this.GetSimplexFractal2 = this.instance.exports.GetSimplexFractal2;
this.GetSimplexFractal2_Strip = this.instance.exports.GetSimplexFractal2_Strip;
this.GetSimplexFractal2_Square = this.instance.exports.GetSimplexFractal2_Square;
this.GetSimplexFractal3 = this.instance.exports.GetSimplexFractal3;
this.GetSimplexFractal3_Strip = this.instance.exports.GetSimplexFractal3_Strip;
this.GetSimplexFractal3_Square = this.instance.exports.GetSimplexFractal3_Square;
this.GetSimplexFractal3_Cube = this.instance.exports.GetSimplexFractal3_Cube;
this.GetSimplexFractal4 = this.instance.exports.GetSimplexFractal4;
this.GetSimplexFractal4_Strip = this.instance.exports.GetSimplexFractal4_Strip;
this.GetSimplexFractal4_Square = this.instance.exports.GetSimplexFractal4_Square;
this.GetSimplexFractal4_Cube = this.instance.exports.GetSimplexFractal4_Cube;
this.SetCellularDistanceFunction = this.instance.exports.SetCellularDistanceFunction;
this.GetCellularDistanceFunction = this.instance.exports.GetCellularDistanceFunction;
this.SetCellularReturnType = this.instance.exports.SetCellularReturnType;
this.GetCellularReturnType = this.instance.exports.GetCellularReturnType;
this.SetCellularDistance2Indices = this.instance.exports.SetCellularDistance2Indices;
this.GetCellularDistanceIndex0 = this.instance.exports.GetCellularDistanceIndex0;
this.GetCellularDistanceIndex1 = this.instance.exports.GetCellularDistanceIndex1;
this.SetCellularJitter = this.instance.exports.SetCellularJitter;
this.GetCellularJitter = this.instance.exports.GetCellularJitter;
this.SetCellularNoiseLookupFrequency = this.instance.exports.SetCellularNoiseLookupFrequency;
this.GetCellularNoiseLookupFrequency = this.instance.exports.GetCellularNoiseLookupFrequency;
this.GetCellular2 = this.instance.exports.GetCellular2;
this.GetCellular2_Strip = this.instance.exports.GetCellular2_Strip;
this.GetCellular2_Square = this.instance.exports.GetCellular2_Square;
this.GetCellular3 = this.instance.exports.GetCellular3;
this.GetCellular3_Strip = this.instance.exports.GetCellular3_Strip;
this.GetCellular3_Square = this.instance.exports.GetCellular3_Square;
this.GetCellular3_Cube = this.instance.exports.GetCellular3_Cube;
this.GetCellularFractal2 = this.instance.exports.GetCellularFractal2;
this.GetCellularFractal2_Strip = this.instance.exports.GetCellularFractal2_Strip;
this.GetCellularFractal2_Square = this.instance.exports.GetCellularFractal2_Square;
this.GetCellularFractal3 = this.instance.exports.GetCellularFractal3;
this.GetCellularFractal3_Strip = this.instance.exports.GetCellularFractal3_Strip;
this.GetCellularFractal3_Square = this.instance.exports.GetCellularFractal3_Square;
this.GetCellularFractal3_Cube = this.instance.exports.GetCellularFractal3_Cube;
this.GetPerlin2_Strip_Values = function(startX, startY, length, direction){let offset = this.GetPerlin2_Strip(startX, startY, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetPerlin2_Square_Values = function(startX, startY, width, height){let offset = this.GetPerlin2_Square(startX, startY, width, height);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetPerlin3_Strip_Values = function(startX, startY, startZ, length, direction){let offset = this.GetPerlin3_Strip(startX, startY, startZ, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetPerlin3_Square_Values = function(startX, startY, startZ, width, height, plane){let offset = this.GetPerlin3_Square(startX, startY, startZ, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetPerlin3_Cube_Values = function(startX, startY, startZ, width, height, depth){let offset = this.GetPerlin3_Cube(startX, startY, startZ, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetPerlinFractal2_Strip_Values = function(startX, startY, length, direction){let offset = this.GetPerlinFractal2_Strip(startX, startY, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetPerlinFractal2_Square_Values = function(startX, startY, width, height){let offset = this.GetPerlinFractal2_Square(startX, startY, width, height);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetPerlinFractal3_Strip_Values = function(startX, startY, startZ, length, direction){let offset = this.GetPerlinFractal3_Strip(startX, startY, startZ, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetPerlinFractal3_Square_Values = function(startX, startY, startZ, width, height, plane){let offset = this.GetPerlinFractal3_Square(startX, startY, startZ, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetPerlinFractal3_Cube_Values = function(startX, startY, startZ, width, height, depth){let offset = this.GetPerlinFractal3_Cube(startX, startY, startZ, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetSimplex2_Strip_Values = function(startX, startY, length, direction){let offset = this.GetSimplex2_Strip(startX, startY, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetSimplex2_Square_Values = function(startX, startY, width, height){let offset = this.GetSimplex2_Square(startX, startY, width, height);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetSimplex3_Strip_Values = function(startX, startY, startZ, length, direction){let offset = this.GetSimplex3_Strip(startX, startY, startZ, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetSimplex3_Square_Values = function(startX, startY, startZ, width, height, plane){let offset = this.GetSimplex3_Square(startX, startY, startZ, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetSimplex3_Cube_Values = function(startX, startY, startZ, width, height, depth){let offset = this.GetSimplex3_Cube(startX, startY, startZ, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetSimplex4_Strip_Values = function(startX, startY, startZ, startW, length, direction){let offset = this.GetSimplex4_Strip(startX, startY, startZ, startW, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetSimplex4_Square_Values = function(startX, startY, startZ, startW, width, height, plane){let offset = this.GetSimplex4_Square(startX, startY, startZ, startW, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetSimplex4_Cube_Values = function(startX, startY, startZ, startW, width, height, depth){let offset = this.GetSimplex4_Cube(startX, startY, startZ, startW, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetSimplexFractal2_Strip_Values = function(startX, startY, length, direction){let offset = this.GetSimplexFractal2_Strip(startX, startY, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetSimplexFractal2_Square_Values = function(startX, startY, width, height){let offset = this.GetSimplexFractal2_Square(startX, startY, width, height);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetSimplexFractal3_Strip_Values = function(startX, startY, startZ, length, direction){let offset = this.GetSimplexFractal3_Strip(startX, startY, startZ, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetSimplexFractal3_Square_Values = function(startX, startY, startZ, width, height, plane){let offset = this.GetSimplexFractal3_Square(startX, startY, startZ, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetSimplexFractal3_Cube_Values = function(startX, startY, startZ, width, height, depth){let offset = this.GetSimplexFractal3_Cube(startX, startY, startZ, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetSimplexFractal4_Strip_Values = function(startX, startY, startZ, startW, length, direction){let offset = this.GetSimplexFractal4_Strip(startX, startY, startZ, startW, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetSimplexFractal4_Square_Values = function(startX, startY, startZ, startW, width, height, plane){let offset = this.GetSimplexFractal4_Square(startX, startY, startZ, startW, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetSimplexFractal4_Cube_Values = function(startX, startY, startZ, startW, width, height, depth){let offset = this.GetSimplexFractal4_Cube(startX, startY, startZ, startW, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetCellular2_Strip_Values = function(startX, startY, length, direction){let offset = this.GetCellular2_Strip(startX, startY, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetCellular2_Square_Values = function(startX, startY, width, height){let offset = this.GetCellular2_Square(startX, startY, width, height);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetCellular3_Strip_Values = function(startX, startY, startZ, length, direction){let offset = this.GetCellular3_Strip(startX, startY, startZ, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetCellular3_Square_Values = function(startX, startY, startZ, width, height, plane){let offset = this.GetCellular3_Square(startX, startY, startZ, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetCellular3_Cube_Values = function(startX, startY, startZ, width, height, depth){let offset = this.GetCellular3_Cube(startX, startY, startZ, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetCellularFractal2_Strip_Values = function(startX, startY, length, direction){let offset = this.GetCellularFractal2_Strip(startX, startY, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetCellularFractal2_Square_Values = function(startX, startY, width, height){let offset = this.GetCellularFractal2_Square(startX, startY, width, height);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetCellularFractal3_Strip_Values = function(startX, startY, startZ, length, direction){let offset = this.GetCellularFractal3_Strip(startX, startY, startZ, length, direction);return new Float32Array(this.memory.buffer.slice(offset, offset+length*4));}
this.GetCellularFractal3_Square_Values = function(startX, startY, startZ, width, height, plane){let offset = this.GetCellularFractal3_Square(startX, startY, startZ, width, height, plane);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*4));}
this.GetCellularFractal3_Cube_Values = function(startX, startY, startZ, width, height, depth){let offset = this.GetCellularFractal3_Cube(startX, startY, startZ, width, height, depth);return new Float32Array(this.memory.buffer.slice(offset, offset+width*height*depth*4));}
this.GetValues = function(offset, elements){return new Float32Array(this.memory.buffer.slice(offset, offset+(elements*4)));}
this.loaded = true;if(this.onLoaded) this.onLoaded();});}
WasmNoise.onLoaded = WasmNoise.onLoaded || null;
WasmNoise.fetchCompileAndInstantiate();
