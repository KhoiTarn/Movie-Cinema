import React, { useState } from 'react';

const FAQ = () => {
    const faqData = [
        {
            category: "Đặt vé & Thanh toán",
            questions: [
                {
                    q: "Làm thế nào để đặt vé trực tuyến?",
                    a: "Bạn chỉ cần chọn bộ phim yêu thích, chọn suất chiếu, chọn chỗ ngồi và tiến hành thanh toán qua các cổng thanh toán được hỗ trợ."
                },
                {
                    q: "Tôi có thể hủy vé đã đặt không?",
                    a: "Theo quy định, vé đã đặt thành công không thể hủy hoặc đổi trả. Vui lòng kiểm tra kỹ thông tin trước khi thanh toán."
                },
                {
                    q: "Hệ thống hỗ trợ các phương thức thanh toán nào?",
                    a: "Chúng tôi hỗ trợ thanh toán qua thẻ nội địa (ATM), thẻ quốc tế (Visa/MasterCard) và các ví điện tử phổ biến."
                }
            ]
        },
        {
            category: "Tài khoản & Thành viên",
            questions: [
                {
                    q: "Làm sao để đăng ký tài khoản thành viên?",
                    a: "Bạn chọn mục 'Đăng ký' trên thanh menu, nhập đầy đủ thông tin cá nhân và xác nhận để bắt đầu sử dụng."
                },
                {
                    q: "Tôi quên mật khẩu thì phải làm sao?",
                    a: "Bạn có thể sử dụng chức năng 'Quên mật khẩu' tại trang đăng nhập. Hệ thống sẽ gửi hướng dẫn khôi phục qua email của bạn."
                }
            ]
        },
        {
            category: "Rạp & Suất chiếu",
            questions: [
                {
                    q: "Tôi nên đến rạp bao lâu trước giờ chiếu?",
                    a: "Bạn nên đến rạp ít nhất 15-20 phút trước giờ chiếu để thực hiện thủ tục in vé và chuẩn bị vào phòng chiếu."
                },
                {
                    q: "Phim có giới hạn độ tuổi không?",
                    a: "Mỗi bộ phim đều có phân loại độ tuổi (P, T13, T16, T18). Vui lòng mang theo giấy tờ tùy thân để nhân viên kiểm tra khi cần thiết."
                }
            ]
        }
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '800' }}>Hỗ Trợ Khách Hàng</h1>
                <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Tìm câu trả lời cho các thắc mắc của bạn hoặc liên hệ với chúng tôi.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '50px' }}>
                {/* Accordion Section */}
                <div>
                    {faqData.map((section, sIdx) => (
                        <div key={sIdx} style={{ marginBottom: '40px' }}>
                            <h2 style={{ color: 'var(--primary-color)', fontSize: '1.4rem', marginBottom: '20px', borderLeft: '4px solid var(--primary-color)', paddingLeft: '15px' }}>
                                {section.category}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {section.questions.map((item, qIdx) => {
                                    const index = `${sIdx}-${qIdx}`;
                                    const isOpen = activeIndex === index;
                                    return (
                                        <div
                                            key={qIdx}
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                borderRadius: '8px',
                                                border: '1px solid #333',
                                                overflow: 'hidden',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <div
                                                onClick={() => toggleAccordion(index)}
                                                style={{
                                                    padding: '18px 25px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <span>{item.q}</span>
                                                <span style={{
                                                    fontSize: '1.2rem',
                                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s',
                                                    color: isOpen ? 'var(--primary-color)' : '#666'
                                                }}>
                                                    ▼
                                                </span>
                                            </div>
                                            <div style={{
                                                maxHeight: isOpen ? '200px' : '0',
                                                overflow: 'hidden',
                                                transition: 'max-height 0.3s ease-out',
                                                backgroundColor: '#111'
                                            }}>
                                                <div style={{ padding: '20px 25px', color: '#ccc', lineHeight: '1.6', borderTop: '1px solid #222' }}>
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Sidebar */}
                <div>
                    <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '1.3rem', textAlign: 'center' }}>Vẫn cần hỗ trợ?</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.5rem' }}>📞</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '3px' }}>Hotline 24/7</div>
                                    <div style={{ fontWeight: 'bold' }}>1900 6000</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.5rem' }}>✉️</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '3px' }}>Email hỗ trợ</div>
                                    <div style={{ fontWeight: 'bold' }}>support@khoicinema.vn</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.5rem' }}>📍</span>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '3px' }}>Văn phòng</div>
                                    <div style={{ fontWeight: 'bold' }}>Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '10px 0' }} />

                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>Kết nối với chúng tôi</p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                    <span style={{ cursor: 'pointer', fontSize: '1.5rem' }}>📘</span>
                                    <span style={{ cursor: 'pointer', fontSize: '1.5rem' }}>📸</span>
                                    <span style={{ cursor: 'pointer', fontSize: '1.5rem' }}>🎵</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
