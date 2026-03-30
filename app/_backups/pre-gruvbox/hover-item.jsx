import React, { memo } from 'react';

const HoverItem = memo(({ slide, totalPages, totalSlides, pagesPath }) => {
    const leftPage = slide * 2 - 2 || 1;
    const rightPage = slide * 2 - 1;
    const label = slide === 1 || (slide === totalSlides && totalPages % 2 === 0)
        ? leftPage
        : `${leftPage}-${rightPage}`;

    return (
        <div>
            <p className="text-xs text-background pb-1">Page {label}</p>
            <div className="flex rounded-md overflow-hidden">
                {pagesPath && leftPage <= totalPages && (
                    <img
                        src={`${pagesPath}/${leftPage}.webp`}
                        alt={`Page ${leftPage}`}
                        width={110}
                        style={{ display: 'block' }}
                    />
                )}
                {pagesPath && rightPage <= totalPages && (
                    <img
                        src={`${pagesPath}/${rightPage}.webp`}
                        alt={`Page ${rightPage}`}
                        width={110}
                        style={{ display: 'block' }}
                    />
                )}
            </div>
        </div>
    );
});

HoverItem.displayName = 'HoverItem';
export default HoverItem;


