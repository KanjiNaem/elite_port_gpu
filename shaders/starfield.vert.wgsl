struct VertexInput {
  @location(0) position: vec3f,
  @location(1) brightness: f32,
}

struct VertexOutput {
  @builtin(position) clip: vec4f,
  @location(0) brightness: f32,
}

@group(0) @binding(0) var<uniform> mvp: mat4x4f;

@vertex
fn main(in: VertexInput) -> VertexOutput {
  var out: VertexOutput;
  out.clip = mvp * vec4f(in.position, 1.0);
  out.brightness = in.brightness;
  return out;
}
