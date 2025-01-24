import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const SocialFeed = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    useEffect(() => {
        fetch('Users.json')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Error fetching posts.');
                setLoading(false);
            });
    }, []);

    const openLightbox = (post, index) => {
        setSelectedPost(post);
        setCurrentImageIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setSelectedPost(null);
    };

    // Filter posts in real-time based on search query, case-insensitive and matching the sender's name
    const filteredUsers = users.filter((post) => {
        return (
            post.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive check
        );
    });

    if (loading) {
        return <div className="text-center p-6">Loading posts...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-6 max-w-screen-sm mx-auto">
            <h1 className="text-2xl font-bold text-center mb-6">Social Feed</h1>
            
            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search posts by sender..."
                    className="w-full p-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Updates the search query
                />
            </div>

            {filteredUsers.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {filteredUsers.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            {/* User Info */}
                            <div className="flex items-center p-4">
                                <img
                                    src={post.sender.avatar}
                                    alt={post.sender.name}
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {post.sender.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {formatDistanceToNow(
                                            new Date(post.timestamp),
                                            { addSuffix: true }
                                        )}
                                    </p>
                                </div>
                            </div>
                            {/* Post Content */}
                            <div className="px-4">
                                <p className="text-gray-700 mb-3">
                                    {post.content.text}
                                </p>
                                <div
                                    className="grid gap-2"
                                    style={{
                                        gridTemplateColumns:
                                            post.content.media.length === 1
                                                ? '1fr'
                                                : post.content.media.length === 2
                                                ? '1fr 1fr'
                                                : 'repeat(auto-fit, minmax(120px, 1fr))',
                                    }}
                                >
                                    {post.content.media.map((media, index) => (
                                        <img
                                            key={index}
                                            src={media.src}
                                            alt={`Post Media ${index}`}
                                            className="rounded-lg object-cover w-full h-40 cursor-pointer"
                                            onClick={() => openLightbox(post, index)}
                                            onContextMenu={(e) => e.preventDefault()}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Post Footer */}
                            <div className="flex justify-between items-center p-4 text-gray-500 border-t">
                                <span>❤️ {post.likes} Likes</span>
                                <span>💬 {post.comments} Comments</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-6 text-gray-500">
                    <p>No posts found matching your search criteria</p>
                </div>
            )}

            {/* Lightbox for selected post's images */}
            {isLightboxOpen && selectedPost && (
                <Lightbox
                    open={isLightboxOpen}
                    close={closeLightbox}
                    slides={selectedPost.content.media.map((media) => ({
                        src: media.src,
                        alt: media.alt || 'Post Image',
                    }))}
                    index={currentImageIndex}
                    onSlideChange={setCurrentImageIndex}
                />
            )}
        </div>
    );
};

export default SocialFeed;
