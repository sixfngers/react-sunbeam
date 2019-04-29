import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { render } from "react-dom"
import { SunbeamProvider, FocusManager, useSunbeam } from "react-sunbeam"

import { ProfilesMenu } from "./ProfilesMenu"
import { GamesGallery } from "./GamesGallery"
import { GamesGallery2 } from "./GamesGallery2"
import { NavigationMenu } from "./NavigationMenu"
import { FocusEvent } from "./FocusableItem"
import { useRef } from "react"

export function App() {
    const [selectedItem, setSelectedItem] = useState<string | null>(null)

    const scrollRef = useRef<HTMLDivElement>(null)
    const [scrollY, setScrollY] = useState<number>(0)

    const { moveFocusLeft, moveFocusRight, moveFocusUp, moveFocusDown } = useSunbeam()
    const onKeyDown = useCallback(
        (event: Event) => {
            if (!(event instanceof KeyboardEvent)) return

            switch (event.key) {
                case "ArrowRight":
                    event.preventDefault()
                    moveFocusRight()
                    return

                case "ArrowLeft":
                    event.preventDefault()
                    moveFocusLeft()
                    return

                case "ArrowUp":
                    event.preventDefault()
                    moveFocusUp()
                    return

                case "ArrowDown":
                    event.preventDefault()
                    moveFocusDown()
                    return

                case " ":
                case "Enter":
                    event.preventDefault()
                    alert(`Selected item: ${selectedItem}`)
                    return
            }
        },
        [focusManager, selectedItem]
    )
    useEffect(() => {
        document.addEventListener("keydown", onKeyDown)

        return () => document.removeEventListener("keydown", onKeyDown)
    }, [onKeyDown])

    const scrollGalleryIntoView = useCallback(
        (event: FocusEvent) => {
            let deltaScrollY = 0

            switch (event.focusPath[0]) {
                case "g0":
                    deltaScrollY = 0
                    break
                case "g1":
                    deltaScrollY = 290
                    break
            }

            // const viewport = viewportRef.current
            // const { width: viewportWidth, left: viewportLeft } = viewport.getBoundingClientRect()
            //
            // const { left: elementLeft, width: elementWidth } = event.element.getBoundingClientRect()
            // const elementOffsetLeft = elementLeft - viewportLeft
            // const elementRightEdge = elementOffsetLeft + elementWidth
            //
            // let deltaScrollX = elementLeft - viewportLeft

            // let deltaScrollX = 0
            // if (elementLeft < viewportLeft) {
            //     deltaScrollX = elementLeft - viewportLeft
            // } else if (elementRightEdge > viewportWidth) {
            //     deltaScrollX = elementRightEdge - viewportWidth
            // }

            const newScrollY = deltaScrollY
            // function ensureScrollXWithinBounds(value: number): number {
            //     const minScrollX = 0
            //     const maxScrollX = trackRef.current.scrollWidth - viewportWidth
            //     if (value < minScrollX) return minScrollX
            //     if (value > maxScrollX) return maxScrollX
            //     return value
            // }
            console.log("newScrollY", newScrollY, scrollY)
            // if (newScrollY !== scrollY)
            setScrollY(newScrollY)
            //
            // onItemFocus(event)
        },
        [scrollY]
    )

    const handleItemFocus = useCallback(
        (event: FocusEvent) => {
            switch (event.focusPath[0]) {
                case "g0":
                    scrollGalleryIntoView(event)
                    break
                case "g1":
                    scrollGalleryIntoView(event)
                    break
            }

            console.log("event.focusPath", event.focusPath)

            setSelectedItem(event.focusPath.join("->"))
        },
        [setSelectedItem]
    )

    return (
        <div
            style={{
                backgroundColor: "#2D2D2D",
                // display: "flex",
                // flexDirection: "column",
                height: "720px",
                width: "1280px",
                overflow: "hidden",
            }}
        >
            <div style={{ marginTop: "32px", marginLeft: "60px" }}>
                <ProfilesMenu onItemFocus={handleItemFocus} />
            </div>

            <div style={{ height: "65%", overflow: "hidden" }}>
                <div
                    id="scrollcontent"
                    ref={scrollRef}
                    style={{
                        transform: `translateY(${-scrollY}px)`,
                        transition: "transform 100ms ease-out",
                        willChange: "transform",
                    }}
                >
                    <div style={{ marginTop: "50px", alignSelf: "center" }}>
                        <GamesGallery usefocuskey={"g0"} onItemFocus={handleItemFocus} />
                    </div>

                    <div style={{ marginTop: "50px", alignSelf: "center" }}>
                        <GamesGallery2 usefocuskey={"g1"} onItemFocus={handleItemFocus} />
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "30px", alignSelf: "center" }}>
                <NavigationMenu onItemFocus={handleItemFocus} />
            </div>
        </div>
    )
}

const focusManager = new FocusManager({
    initialFocusPath: [],
})

render(
    <SunbeamProvider focusManager={focusManager}>
        <App />
    </SunbeamProvider>,
    document.getElementById("app")
)
