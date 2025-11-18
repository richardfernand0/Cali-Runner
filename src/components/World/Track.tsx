import { useState, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import { Segment } from './Segment'
import { useGameStore } from '../../store/gameStore'
import { getTrackOffset } from '../../logic/TrackLogic'
import * as THREE from 'three'

const SEGMENT_LENGTH = 20
const DRAW_DISTANCE = 12 // Segments ahead
const BACK_BUFFER = 3 // Segments behind

// Shared Geometries and Materials to prevent recreation
const groundGeo = new THREE.PlaneGeometry(200, SEGMENT_LENGTH)
const trailGeo = new THREE.PlaneGeometry(10, SEGMENT_LENGTH)
const groundMat = new THREE.MeshStandardMaterial({ color: "#2d4c1e" })
const trailMat = new THREE.MeshStandardMaterial({ color: "#8b5a2b" })

export function Track() {
    const playerZ = useGameStore((state) => state.distance)

    // We need to track the range of indices we are rendering
    const [range, setRange] = useState({ start: -BACK_BUFFER, end: DRAW_DISTANCE })

    useFrame(() => {
        const currentSegmentIndex = Math.floor(playerZ / SEGMENT_LENGTH)

        // Update range if player moves to a new segment
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
                    <SegmentTreeInstances key={`trees-${segment.index}`} index={segment.index} z={segment.z} />
                ))}
            </Instances>

            <Instances range={5000}>
                <coneGeometry args={[0.2, 0.5, 3]} />
                <meshStandardMaterial color="#4a6b3e" />
                {segments.map(segment => (
                    <SegmentGrassInstances key={`grass-${segment.index}`} index={segment.index} z={segment.z} />
                ))}
            </Instances>

            {/* Ground and Items */}
            {segments.map(segment => {
                const { x, rotation } = getTrackOffset(-segment.z)
                return (
                    <MemoizedSegment
                        key={segment.index}
                        index={segment.index}
                        positionX={x}
                        positionZ={-segment.z}
                        rotationY={rotation}
                        groundGeo={groundGeo}
                        trailGeo={trailGeo}
                        groundMat={groundMat}
                        trailMat={trailMat}
                    />
                )
            })}
        </group>
    )
}

// Memoized Wrapper for Segment
const MemoizedSegment = memo(function MemoizedSegmentWrapper({
    index, positionX, positionZ, rotationY, groundGeo, trailGeo, groundMat, trailMat
}: any) {
    return (
        <Segment
            index={index}
            position={[positionX, 0, positionZ]}
            rotation={[0, rotationY, 0]}
            renderVisuals={false}
            groundGeo={groundGeo}
            trailGeo={trailGeo}
            groundMat={groundMat}
            trailMat={trailMat}
        />
    )
}, (prev, next) => {
    // Custom comparison to avoid re-render on array prop creation
    return prev.index === next.index &&
        prev.positionX === next.positionX &&
        prev.positionZ === next.positionZ &&
        prev.rotationY === next.rotationY
})

// Helper components to render instances for a segment
const SegmentTreeInstances = memo(function SegmentTreeInstances({ index, z }: { index: number, z: number }) {
    const { x: trackX, rotation: trackRot } = getTrackOffset(-z)

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
            const posZ = -z + xOffset * Math.sin(trackRot) + zOffset * Math.cos(trackRot)

            items.push({ position: [x, 0, posZ], scale: 0.5 + Math.random() * 0.5 })
        }
        return items
    }, [z, trackX, trackRot])

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
})

const SegmentGrassInstances = memo(function SegmentGrassInstances({ index, z }: { index: number, z: number }) {
    const { x: trackX, rotation: trackRot } = getTrackOffset(-z)

    const grass = useMemo(() => {
        const items = []
        for (let i = 0; i < 100; i++) { // Increased count
            const isLeft = Math.random() > 0.5
            const xOffset = isLeft
                ? -6 - Math.random() * 80 // Increased spread to cover wider ground
                : 6 + Math.random() * 80
            const zOffset = Math.random() * SEGMENT_LENGTH - SEGMENT_LENGTH / 2

            const x = trackX + xOffset * Math.cos(trackRot) - zOffset * Math.sin(trackRot)
            const posZ = -z + xOffset * Math.sin(trackRot) + zOffset * Math.cos(trackRot)

            items.push({ position: [x, 0, posZ], scale: 0.5 + Math.random() * 0.5, rotation: Math.random() * Math.PI })
        }
        return items
    }, [z, trackX, trackRot])

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
})
