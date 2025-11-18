import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import { Segment } from './Segment'
import { useGameStore } from '../../store/gameStore'
import { getTrackOffset } from '../../logic/TrackLogic'

const SEGMENT_LENGTH = 20
const DRAW_DISTANCE = 12 // Segments ahead
const BACK_BUFFER = 3 // Segments behind

export function Track() {
    const playerZ = useGameStore((state) => state.distance)

    // We need to track the range of indices we are rendering
    // Initial state: -BACK_BUFFER to DRAW_DISTANCE
    const [range, setRange] = useState({ start: -BACK_BUFFER, end: DRAW_DISTANCE })

    useFrame(() => {
        const currentSegmentIndex = Math.floor(playerZ / SEGMENT_LENGTH)

        // Update range if player moves to a new segment
        // We want to keep [current - BACK, current + DRAW]
        if (currentSegmentIndex + DRAW_DISTANCE > range.end || currentSegmentIndex - BACK_BUFFER < range.start) {
            setRange({
                start: currentSegmentIndex - BACK_BUFFER,
                end: currentSegmentIndex + DRAW_DISTANCE
            })
        }
    })

    // Generate segments based on range
    const segments = useMemo(() => {
        const segs = []
        for (let i = range.start; i <= range.end; i++) {
            segs.push({ index: i, z: i * SEGMENT_LENGTH })
        }
        return segs
    }, [range])

    return (
        <group>
            {/* Shared Materials and Geometries for Instancing */}
            <Instances range={1000} castShadow receiveShadow>
                <cylinderGeometry args={[0.5, 1, 4]} />
                <meshStandardMaterial color="#1e3d1e" />
                {segments.map(segment => (
                    <SegmentTreeInstances key={`trees-${segment.index}`} segment={segment} />
                ))}
            </Instances>

            <Instances range={5000}>
                <coneGeometry args={[0.2, 0.5, 3]} />
                <meshStandardMaterial color="#4a6b3e" />
                {segments.map(segment => (
                    <SegmentGrassInstances key={`grass-${segment.index}`} segment={segment} />
                ))}
            </Instances>

            {/* Ground and Items are still individual per segment for now, or could be instanced too */}
            {segments.map(segment => {
                const { x, rotation } = getTrackOffset(-segment.z)
                return (
                    <Segment
                        key={segment.index}
                        index={segment.index}
                        position={[x, 0, -segment.z]}
                        rotation={[0, rotation, 0]}
                        renderVisuals={false} // Only render ground/items, not trees/grass
                    />
                )
            })}
        </group>
    )
}

// Helper components to render instances for a segment
function SegmentTreeInstances({ segment }: { segment: { z: number, index: number } }) {
    const { x: trackX, rotation: trackRot } = getTrackOffset(-segment.z)

    const trees = useMemo(() => {
        const items = []
        for (let i = 0; i < 5; i++) {
            const isLeft = Math.random() > 0.5
            const xOffset = isLeft
                ? -10 - Math.random() * 15
                : 10 + Math.random() * 15
            const zOffset = Math.random() * SEGMENT_LENGTH - SEGMENT_LENGTH / 2

            // Apply rotation to local offset
            const x = trackX + xOffset * Math.cos(trackRot) - zOffset * Math.sin(trackRot)
            const z = -segment.z + xOffset * Math.sin(trackRot) + zOffset * Math.cos(trackRot)

            items.push({ position: [x, 0, z], scale: 0.5 + Math.random() * 0.5 })
        }
        return items
    }, [segment.z, trackX, trackRot])

    return (
        <group>
            {trees.map((tree, i) => (
                <Instance
                    key={i}
                    position={tree.position as [number, number, number]}
                    scale={[tree.scale, tree.scale, tree.scale]}
                />
            ))}
        </group>
    )
}

function SegmentGrassInstances({ segment }: { segment: { z: number, index: number } }) {
    const { x: trackX, rotation: trackRot } = getTrackOffset(-segment.z)

    const grass = useMemo(() => {
        const items = []
        for (let i = 0; i < 100; i++) { // Increased count
            const isLeft = Math.random() > 0.5
            const xOffset = isLeft
                ? -6 - Math.random() * 80 // Increased spread to cover wider ground
                : 6 + Math.random() * 80
            const zOffset = Math.random() * SEGMENT_LENGTH - SEGMENT_LENGTH / 2

            const x = trackX + xOffset * Math.cos(trackRot) - zOffset * Math.sin(trackRot)
            const z = -segment.z + xOffset * Math.sin(trackRot) + zOffset * Math.cos(trackRot)

            items.push({ position: [x, 0, z], scale: 0.5 + Math.random() * 0.5, rotation: Math.random() * Math.PI })
        }
        return items
    }, [segment.z, trackX, trackRot])

    return (
        <group>
            {grass.map((g, i) => (
                <Instance
                    key={i}
                    position={g.position as [number, number, number]}
                    scale={[g.scale, g.scale, g.scale]}
                    rotation={[0, g.rotation, 0]}
                />
            ))}
        </group>
    )
}
