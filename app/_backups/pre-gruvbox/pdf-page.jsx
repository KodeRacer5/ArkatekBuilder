import React, { forwardRef, memo } from "react";

const PdfPage = forwardRef(({ page, height, isPageInViewRange, pagesPath, isHard }, ref) => {
    const isLeftPage = page % 2 === 0;

    return (
        <div
            ref={ref}
            data-density={isHard ? 'hard' : 'soft'}
            style={{
                height,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8f4ef',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                isolation: 'isolate',
                position: 'relative',
            }}
        >
            {isPageInViewRange && pagesPath ? (
                <>
                    <img
                        src={`${pagesPath}/${page}.webp`}
                        alt={`Page ${page}`}
                        style={{ height: '100%', width: 'auto', display: 'block', userSelect: 'none', position: 'relative', zIndex: 1 }}
                        loading="eager"
                        draggable={false}
                    />
                    {/* Paper texture overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                        background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
                        opacity: 0.4,
                    }} />
                    {/* Spine binding gradient */}
                    <div style={{
                        position: 'absolute', top: 0, bottom: 0, zIndex: 3, pointerEvents: 'none',
                        width: 18,
                        [isLeftPage ? 'right' : 'left']: 0,
                        background: isLeftPage
                            ? 'linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)'
                            : 'linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)',
                    }} />
                </>
            ) : (
                <div style={{ height, width: '100%', background: '#f8f4ef' }} />
            )}
        </div>
    );
});

PdfPage.displayName = "PdfPage";
export default memo(PdfPage);


