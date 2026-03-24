struct VertexInput {
  @location(0) position: vec3f,
}

@group(0) @binding(0) var<uniform> mvp: mat4x4f;

@vertex
fn main(in: VertexInput) -> @builtin(position) vec4f {
  return mvp * vec4f(in.position, 1.0);
}
