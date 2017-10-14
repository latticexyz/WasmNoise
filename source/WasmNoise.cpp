#include "WasmNoise.hpp"
#include "xoroshiro128plus.hpp"
#include "uniform_int_distribution.hpp"

const WN_DECIMAL GRAD_X[] =
{
  1, -1, 1, -1,
  1, -1, 1, -1,
  0,  0, 0,  0
};

const WN_DECIMAL GRAD_Y[] =
{
  1,  1, -1, -1,
  0,  0,  0,  0,
  1, -1,  1, -1
};

const WN_DECIMAL GRAD_Z[] =
{
  0, 0,  0,  0,
  1, 1, -1, -1,
  1, 1, -1, -1
};

static WN_INLINE int32 FastFloor(WN_DECIMAL f) { return (f >= 0 ? static_cast<int32>(f) : static_cast<int32>(f) - 1); }
static WN_INLINE int32 FastRound(WN_DECIMAL f) { return (f >= 0 ? static_cast<int32>(f + WN_DECIMAL(0.5)) : static_cast<int32>(f - WN_DECIMAL(0.5))); }
static WN_INLINE int32 FastAbs(int32 i) { return __builtin_labs(i); }
static WN_INLINE WN_DECIMAL FastAbs(WN_DECIMAL f){ return __builtin_fabs(f); }
static WN_INLINE WN_DECIMAL Lerp(WN_DECIMAL a, WN_DECIMAL b, WN_DECIMAL t) { return a + t * (b - a); }
static WN_INLINE WN_DECIMAL InterpHermiteFunc(WN_DECIMAL t) { return t*t*(3 - 2*t); }
static WN_INLINE WN_DECIMAL InterpQuinticFunc(WN_DECIMAL t) { return t*t*t*(t*(t*6 -15) + 10); }
static WN_INLINE WN_DECIMAL CubicLerp(WN_DECIMAL a, WN_DECIMAL b, WN_DECIMAL c, WN_DECIMAL d, WN_DECIMAL t)
{
  WN_DECIMAL p = (d-c)-(a-b);
  return t*t*t*p + t*t*((a-b)-p) + t*(c-a) + b;
}

void WasmNoise::SetSeed(int32 _seed)
{
  seed = _seed;

  xoroshiro128plus gen(seed); 

  for(int32 i = 0; i < 256; i++)
  {
    perm[i] = i;
  }

  for(int32 j = 0; j < 256; j++)
  {
    uniform_int_distribution<> dist(0, 256-j);
    int k = dist(gen) + j;
    int l = perm[j];
    perm[j] = perm[j + 256] = perm[k];
    perm[k] = l;
    perm12[j] = perm12[j+256] = perm[j] % 12;
  }
}

// Index Functions
WN_INLINE uint8 WasmNoise::Index2D_12(uint8 offset, int32 x, int32 y) const
{
  return perm12[(x & 0xff) + perm[(y & 0xff) + offset]];
}

WN_INLINE uint8 WasmNoise::Index3D_12(uint8 offset, int32 x, int32 y, int32 z) const
{
  return perm12[(x & 0xff) + perm[(y & 0xff) + perm[(z &0xff) + offset]]];
}

// Gradient Coordinate Functions
WN_INLINE WN_DECIMAL WasmNoise::GradCoord2D(uint8 offset, int32 x, int32 y, WN_DECIMAL xd, WN_DECIMAL yd) const
{
  uint8 lutPos = Index2D_12(offset, x, y);
  return xd*GRAD_X[lutPos] + yd*GRAD_Y[lutPos];
}

WN_INLINE WN_DECIMAL WasmNoise::GradCoord3D(uint8 offset, int32 x, int32 y, int32 z, WN_DECIMAL xd, WN_DECIMAL yd, WN_DECIMAL zd) const
{
  uint8 lutPos = Index3D_12(offset, x, y, z);
  return xd*GRAD_X[lutPos] + yd*GRAD_Y[lutPos] + zd*GRAD_Z[lutPos];
}

// Single noise function section *******************************

// 2D Perlin
WN_INLINE WN_DECIMAL WasmNoise::SinglePerlin(uint8 offset, WN_DECIMAL x, WN_DECIMAL y) const
{
  int32 x0 = FastFloor(x);
  int32 y0 = FastFloor(y);
  int32 x1 = x0+1;
  int32 y1 = y0+1;

  WN_DECIMAL xs, ys;
  switch(interp)
  {
  case Interp::Linear:
    xs = x - static_cast<WN_DECIMAL>(x0);
    ys = y - static_cast<WN_DECIMAL>(y0);
    break;
  case Interp::Hermite:
    xs = InterpHermiteFunc(x - static_cast<WN_DECIMAL>(x0));
    ys = InterpHermiteFunc(y - static_cast<WN_DECIMAL>(y0));
    break;
  case Interp::Quintic:
    xs = InterpQuinticFunc(x - static_cast<WN_DECIMAL>(x0));
    ys = InterpQuinticFunc(y - static_cast<WN_DECIMAL>(y0));
    break;
  }  
  
  WN_DECIMAL xd0 = x - static_cast<WN_DECIMAL>(x0);
  WN_DECIMAL yd0 = y - static_cast<WN_DECIMAL>(y0);
  WN_DECIMAL xd1 = xd0 - 1;
  WN_DECIMAL yd1 = yd0 - 1;

  WN_DECIMAL xf0 = Lerp(GradCoord2D(offset, x0, y0, xd0, yd0), GradCoord2D(offset, x1, y0, xd1, yd0), xs);
  WN_DECIMAL xf1 = Lerp(GradCoord2D(offset, x0, y1, xd0, yd1), GradCoord2D(offset, x1, y1, xd1, yd1), xs);

  return Lerp(xf0, xf1, ys);
}

// 3D Perlin
WN_INLINE WN_DECIMAL WasmNoise::SinglePerlin(uint8 offset, WN_DECIMAL x, WN_DECIMAL y, WN_DECIMAL z) const
{
  int32 x0 = FastFloor(x);
  int32 y0 = FastFloor(y);
  int32 z0 = FastFloor(z);
  int32 x1 = x0 + 1;
  int32 y1 = y0 + 1;
  int32 z1 = z0 + 1;

  WN_DECIMAL xs, ys, zs;
  switch(interp)
  {
  case Interp::Linear:
    xs = x - static_cast<WN_DECIMAL>(x0);
    ys = y - static_cast<WN_DECIMAL>(y0);
    zs = z - static_cast<WN_DECIMAL>(z0);
    break;
  case Interp::Hermite:
    xs = InterpHermiteFunc(x - static_cast<WN_DECIMAL>(x0));
    ys = InterpHermiteFunc(y - static_cast<WN_DECIMAL>(y0));
    zs = InterpHermiteFunc(z - static_cast<WN_DECIMAL>(z0));
    break;
  case Interp::Quintic:
    xs = InterpQuinticFunc(x - static_cast<WN_DECIMAL>(x0));
    ys = InterpQuinticFunc(y - static_cast<WN_DECIMAL>(y0));
    zs = InterpQuinticFunc(z - static_cast<WN_DECIMAL>(z0));  
    break;
  }
  
  WN_DECIMAL xd0 = x - static_cast<WN_DECIMAL>(x0);
  WN_DECIMAL yd0 = y - static_cast<WN_DECIMAL>(y0);
  WN_DECIMAL zd0 = z - static_cast<WN_DECIMAL>(z0);
  WN_DECIMAL xd1 = xd0 - 1;
  WN_DECIMAL yd1 = yd0 - 1;
  WN_DECIMAL zd1 = zd0 - 1;

  WN_DECIMAL xf00 = Lerp(GradCoord3D(offset, x0, y0, z0, xd0, yd0, zd0), GradCoord3D(offset, x1, y0, z0, xd1, yd0, zd0), xs);
  WN_DECIMAL xf10 = Lerp(GradCoord3D(offset, x0, y1, z0, xd0, yd1, zd0), GradCoord3D(offset, x1, y1, z0, xd1, yd1, zd0), xs);
  WN_DECIMAL xf01 = Lerp(GradCoord3D(offset, x0, y0, z1, xd0, yd0, zd1), GradCoord3D(offset, x1, y0, z1, xd1, yd0, zd1), xs);
  WN_DECIMAL xf11 = Lerp(GradCoord3D(offset, x0, y1, z1, xd0, yd1, zd1), GradCoord3D(offset, x1, y1, z1, xd1, yd1, zd1), xs);

  WN_DECIMAL yf0 = Lerp(xf00, xf10, ys);
  WN_DECIMAL yf1 = Lerp(xf01, xf11, ys);

  return Lerp(yf0, yf1, zs);
}

// End single noise function section ***************************

// Public Perlin Noise functions

// 2D
WN_INLINE WN_DECIMAL WasmNoise::GetPerlin(WN_DECIMAL x, WN_DECIMAL y) const
{
  return SinglePerlin(0, x * frequency, y * frequency);
}

// TODO: Add direction? X/Y axis, vector?
WN_INLINE WN_DECIMAL *WasmNoise::GetPerlinStrip(WN_DECIMAL startX, WN_DECIMAL startY, uint32 length)
{
  WN_DECIMAL *values = returnHelper.NewArray(length);
  for(uint32 i = 0; i < length; i++)
  {
    values[i] = SinglePerlin(0, (startX+i) * frequency, startY * frequency);
  }
  return values;
}

WN_INLINE WN_DECIMAL *WasmNoise::GetPerlinSquare(WN_DECIMAL startX, WN_DECIMAL startY, uint32 width, uint32 height)  
{
  WN_DECIMAL *values = returnHelper.NewArray(width*height);
  for(uint32 y = 0; y < height; y++)
  {
    for(uint32 x = 0; x < width; x++)
    {
      values[(width * y) + x] = SinglePerlin(0, (startX+x) * frequency, (startY+y) * frequency);
    }
  }
  return values;
}

// 3D
WN_INLINE WN_DECIMAL WasmNoise::GetPerlin(WN_DECIMAL x, WN_DECIMAL y, WN_DECIMAL z) const
{
  return SinglePerlin(0, x * frequency, y * frequency, z * frequency);
}

WN_INLINE WN_DECIMAL *WasmNoise::GetPerlinStrip(WN_DECIMAL startX, WN_DECIMAL startY, WN_DECIMAL startZ, uint32 length)
{
  WN_DECIMAL *values = returnHelper.NewArray(length);
  for(uint32 i = 0; i < length; i++)
  {
    values[i] = SinglePerlin(0, (startX + i) * frequency, startY *frequency, startZ * frequency);
  }
  return values;
}

WN_INLINE WN_DECIMAL *WasmNoise::GetPerlinSquare(WN_DECIMAL startX, WN_DECIMAL startY, WN_DECIMAL startZ, uint32 width, uint32 height)
{
  WN_DECIMAL *values = returnHelper.NewArray(width*height);
  for(uint32 y = 0; y < height; y++)
  {
    for(uint32 x = 0; x < width; x++)
    {
      values[(width * y) + x] = SinglePerlin(0, (startX+x) * frequency, (startY+y) * frequency, startZ * frequency);
    }
  }
  return values;
}

WN_INLINE WN_DECIMAL *WasmNoise::GetPerlinCube(WN_DECIMAL startX, WN_DECIMAL startY, WN_DECIMAL startZ, uint32 width, uint32 height, uint32 depth)
{
  WN_DECIMAL *values = returnHelper.NewArray(width*height*depth);
  for(uint32 z = 0; z < depth; z++)
  {
    for(uint32 y = 0; y < height; y++)
    {
      for(uint32 x = 0; x < width; x++)
      {
        values[(height * width * z) + (width * y) + x] = SinglePerlin(0, (startX+x) * frequency, (startY+y) * frequency, (startZ+z) * frequency);
      }
    }
  }
  return values;
}
