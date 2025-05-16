

export default function Card({url, onClick})
{
    return (
        <div className="border-10 lg:border-15 border-gray-50 dark:border-white rounded-xs">
            <a onClick={() => onClick()} className="cursor-pointer">
                <img src={url} className="h-32 w-30 md:h-32 md:w-32 lg:h-54 lg:w-64 !object-cover !overflow-hidden"/>
            </a>
        </div>
    )
}