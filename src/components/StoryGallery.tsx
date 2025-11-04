import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Button } from './ui/button';

interface InViewImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const InViewImage = ({ src, alt, ...props }: InViewImageProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 200
  });

  return (
    <div ref={ref} className="w-full h-full">
      {inView ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          {...props}
        />
      ) : (
        <div className="w-full h-full bg-rose-100/50 animate-pulse rounded-3xl" />
      )}
    </div>
  );
};

interface Story {
  id: number;
  image: string;
  caption: string;
  date: string;
  description: string;
}

const stories: Story[] = [
  {
    id: 1,
    image: '/gallery/1.jpg',
    caption: 'The best moment of my life',
    date: 'Standing with you seems to be a dream come true😭❤️',
    description: 'Standing with you seems to be a dream come true.',
  },
  {
    id: 2,
    image: '/gallery/2.jpg',
    caption: 'The Second Moment That Stole My Heart',
    date: '🥹',
    description: 'Each moment with you brings joy that words cannot express. Your laughter is my favorite melody.',
  },
  {
    id: 3,
    image: '/gallery/3.jpg',
    caption: 'Sitting together in a love that never ends',
    date: 'Shoulder to Shoulder, always',
    description: 'With every step we take together, our love grows stronger. You make every journey beautiful.',
  },
  
];

interface StoryGalleryProps {
  onContinue: () => void;
  onBack: () => void;
}

const StoryGallery = ({ onContinue, onBack }: StoryGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openLightbox = (index: number) => {
    setIsLoading(true);
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setIsLoading(true);
      setSelectedImage((selectedImage + 1) % stories.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setIsLoading(true);
      setSelectedImage((selectedImage - 1 + stories.length) % stories.length);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section className="relative w-full min-h-screen py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 overflow-hidden">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-rose-200 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              fontSize: `${Math.random() * 40 + 20}px`,
            }}
            fill="currentColor"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-dancing text-5xl md:text-7xl text-rose-600 mb-6 animate-title-fade-in sparkle">
            Hamare Zindagi k Khoobsurat Pal  
          </h2>
          <p className="font-poppins text-lg md:text-xl text-rose-700/80 max-w-2xl mx-auto animate-fade-in-up">
            Each photo tells a story of our love, har lamha yao qeemati yaad da zama aur sta pa zara k 😭❤️
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => openLightbox(index)}
              className="group relative overflow-hidden rounded-3xl bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-rose-200/50 transition-all duration-500 cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <InViewImage
                  src={story.image}
                  alt={story.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/90 via-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="absolute bottom-4 right-4 text-white w-6 h-6 animate-twinkle" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-dancing text-2xl mb-2">{story.caption}</p>
                <p className="font-poppins text-sm opacity-90">{story.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
            <Button
              onClick={closeLightbox}
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:text-rose-400 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </Button>

            <Button
              onClick={prevImage}
              variant="ghost"
              size="icon"
              className="absolute left-6 text-white hover:text-rose-400 transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </Button>

            <Button
              onClick={nextImage}
              variant="ghost"
              size="icon"
              className="absolute right-6 text-white hover:text-rose-400 transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </Button>

            <div className="max-w-5xl w-full px-4 animate-fade-in-up">
              <div className="relative rounded-3xl overflow-hidden glass-effect">
                {isLoading && (
                  <div className="absolute inset-0 bg-rose-100/20 animate-pulse flex items-center justify-center">
                    <Heart className="w-12 h-12 text-rose-400 animate-heart-beat" />
                  </div>
                )}
                <img
                  src={stories[selectedImage].image}
                  alt={stories[selectedImage].caption}
                  onLoad={handleImageLoad}
                  className="w-full h-auto rounded-3xl shadow-xl transition-transform duration-500"
                />
              </div>
              <div className="text-center mt-8 glass-effect p-8 rounded-3xl">
                <p className="font-dancing text-3xl text-white mb-3 sparkle">
                  {stories[selectedImage].caption}
                </p>
                <p className="font-poppins text-lg text-rose-200 mb-4">
                  {stories[selectedImage].date}
                </p>
                <p className="font-poppins text-white/80 max-w-2xl mx-auto leading-relaxed">
                  {stories[selectedImage].description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons (inline flow) */}
      <div className="nav-buttons-inline">
          <button
            onClick={onBack}
            className="nav-button nav-button-back"
          >
            Back to Welcome
          </button>
          <button
            onClick={onContinue}
            className="nav-button nav-button-next"
          >
            Read My Letter
          </button>
      </div>
    </section>
  );
};

export default StoryGallery;
