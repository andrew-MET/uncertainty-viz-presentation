// Fragment shader for meteor trail
// Creates reddish gradient that fades from ball to trail end

varying vec2 vUv;

void main() {
    // UV.x goes from 0 (newest/closest to ball) to 1 (oldest/farthest)
    float distanceFromBall = vUv.x;

    // Fade out along the trail length
    float opacity = 1.0 - distanceFromBall;
    opacity = pow(opacity, 2.0); // Squared for sharper falloff

    // Red-orange gradient colors
    vec3 hotColor = vec3(1.0, 0.3, 0.1); // Bright red-orange near ball
    vec3 coolColor = vec3(0.8, 0.1, 0.05); // Darker red at trail end

    // Mix colors based on distance
    vec3 color = mix(hotColor, coolColor, distanceFromBall);

    // Add edge fade for ribbon width (UV.y goes 0 to 1 across width)
    float edgeFade = 1.0 - abs(vUv.y - 0.5) * 2.0;
    edgeFade = smoothstep(0.0, 1.0, edgeFade);

    // Combine opacity factors
    float finalOpacity = opacity * edgeFade;

    // Output with transparency
    gl_FragColor = vec4(color, finalOpacity);
}
