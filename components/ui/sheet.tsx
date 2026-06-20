import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface SheetContextValue {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

function useSheet() {
    const context = React.useContext(SheetContext)
    if (!context) {
        throw new Error("useSheet must be used within a Sheet")
    }
    return context
}

interface SheetProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const Sheet = ({ open: controlledOpen, onOpenChange, children }: SheetProps) => {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange || (() => { }) : setInternalOpen

    return (
        <SheetContext.Provider value={{ open, onOpenChange: setOpen as any }}>
            {children}
        </SheetContext.Provider>
    )
}

const SheetTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
    const { onOpenChange } = useSheet()

    if (asChild && React.isValidElement(children)) {
        const childElement = children as React.ReactElement<any>
        return React.cloneElement(childElement, {
            onClick: (e: any) => {
                onOpenChange(true)
                childElement.props?.onClick?.(e)
            },
        })
    }

    return (
        <button
            ref={ref}
            onClick={() => onOpenChange(true)}
            {...props}
        >
            {children}
        </button>
    )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ asChild, children, ...props }, ref) => {
    const { onOpenChange } = useSheet()

    if (asChild && React.isValidElement(children)) {
        const childElement = children as React.ReactElement<any>
        return React.cloneElement(childElement, {
            onClick: (e: any) => {
                onOpenChange(false)
                childElement.props?.onClick?.(e)
            },
        })
    }

    return (
        <button
            ref={ref}
            onClick={() => onOpenChange(false)}
            {...props}
        >
            {children}
        </button>
    )
})
SheetClose.displayName = "SheetClose"

interface SheetContentProps
    extends React.HTMLAttributes<HTMLDivElement> {
    side?: "top" | "right" | "bottom" | "left"
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
    ({ side = "right", className, children, ...props }, ref) => {
        const { open, onOpenChange } = useSheet()

        React.useEffect(() => {
            if (open) {
                document.body.style.overflow = "hidden"
            } else {
                document.body.style.overflow = ""
            }
            return () => {
                document.body.style.overflow = ""
            }
        }, [open])

        if (!open) return null

        const sideClasses = {
            top: "top-0 left-0 right-0 border-b rounded-b-lg max-h-[50%]",
            right: "top-0 right-0 h-full border-l rounded-l-lg w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/3",
            bottom: "bottom-0 left-0 right-0 border-t rounded-t-lg max-h-[50%]",
            left: "top-0 left-0 h-full border-r rounded-r-lg w-3/4 sm:w-1/2 md:w-2/5 lg:w-1/3",
        }

        const slideInClass = {
            top: "animate-in slide-in-from-top",
            right: "animate-in slide-in-from-right",
            bottom: "animate-in slide-in-from-bottom",
            left: "animate-in slide-in-from-left",
        }

        return (
            <>
                {/* Backdrop */}
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in"
                    onClick={() => onOpenChange(false)}
                />
                {/* Sheet */}
                <div
                    ref={ref}
                    className={cn(
                        "fixed z-50 gap-4 bg-background p-6 shadow-lg duration-200",
                        sideClasses[side],
                        slideInClass[side],
                        className
                    )}
                    {...props}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                    {children}
                </div>
            </>
        )
    }
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-2 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold text-foreground",
            className
        )}
        {...props}
    />
))
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
SheetDescription.displayName = "SheetDescription"

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
