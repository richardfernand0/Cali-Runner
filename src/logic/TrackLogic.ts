export function getTrackOffset(z: number) {
    // Simple sine wave for testing
    // Amplitude: How wide the curve is
    // Frequency: How fast it curves
    const amplitude = 10 // Reduced from 20
    const frequency = 0.02 // Reduced from 0.05 for smoother curves

    const x = amplitude * Math.sin(z * frequency)

    // Calculate rotation (derivative/tangent)
    // d/dz (A * sin(f * z)) = A * f * cos(f * z)
    // This gives us the slope. Angle = atan(slope)
    const slope = amplitude * frequency * Math.cos(z * frequency)
    const rotation = -Math.atan(slope) // Negative because we rotate opposite to slope to stay flat? 
    // Wait, if slope is positive (going right), we want to rotate Y axis to face right.
    // Standard rotation Y: positive is left (counter-clockwise).
    // So if slope is positive, we want negative rotation?
    // Let's stick with atan(slope) and adjust sign if needed visually.

    return { x, rotation }
}
