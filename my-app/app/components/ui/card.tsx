export const Card = ({ className, children}:{className:string, children:React.ReactNode}) => {
    return <div className={className}>
        {children}
    </div>
}

export const CardContent = ({ className, children}:{className:string, children:React.ReactNode}) => {
    return <div className={className}>
        {children}
    </div>
}