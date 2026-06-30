import React from 'react'

const HeaderContents = () => {

    const headerItems = [
        { text: 'Pending', },
        { text: 'Confirmed', },
        { text: 'Assigned', },
        { text: 'Arrived', },
        { text: 'Started', },
        { text: 'Completed', },
        { text: 'Cancelled', },
    ];

    const getBorderColor = (text) => {
        switch (text.toLowerCase()) {
            case 'pending':
                return 'border-brand-pending';
            case 'confirmed':
                return 'border-brand-confirmed';
            case 'assigned':
                return 'border-brand-assign'; // ✅ Fixed
            case 'arrived':
                return 'border-brand-arrived';
            case 'started':
                return 'border-brand-started';
            case 'completed':
                return 'border-brand-completed';
            case 'cancelled':
                return 'border-brand-cancelled';
            default:
                return 'border-white';
        }
    };

    const getTextColor = (text) => {
        switch (text.toLowerCase()) {
            case 'pending':
                return 'text-brand-pending';
            case 'confirmed':
                return 'text-brand-confirmed';
            case 'assigned':
                return 'text-brand-assign';
            case 'arrived':
                return 'text-brand-arrived';
            case 'started':
                return 'text-brand-started';
            case 'completed':
                return 'text-brand-completed';
            case 'cancelled':
                return 'text-brand-cancelled';
            default:
                return 'text-white';
        }
    };

    return (
        <div className='flex items-center gap-4'>
            {headerItems.map((item, index) => (
                <button
                    key={index}
                    onClick={() => alert(`You Clicked on ${item.text}`)}
                    className={`p-[4px] pl-4 pr-4 rounded-md border hover:bg-white hover:text-black transition-colors duration-200 ${getBorderColor(item.text)} 
                    ${getTextColor(item.text)}`}
                >
                    <span className={`text-md`}>{item.text}</span>
                </button>
            ))}
        </div>
    )
}

export default HeaderContents