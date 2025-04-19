import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

describe('Komponen Modal', () => {
  const mockOnClose = jest.fn();
  const modalContent = <div data-testid="modal-children">Konten Modal</div>;

  beforeEach(() => {
    // Reset mock sebelum setiap test
    mockOnClose.mockClear();
    // Reset style pada document.body
    document.body.style.overflow = '';
  });

  test('merender children dengan benar', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(screen.getByTestId('modal-children')).toBeInTheDocument();
    expect(screen.getByText('Konten Modal')).toBeInTheDocument();
  });

  test('menampilkan tombol close', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  test('memanggil onClose saat tombol close diklik', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('memanggil onClose saat backdrop diklik', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('tidak memanggil onClose saat konten modal diklik', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.click(screen.getByTestId('modal-children'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('memanggil onClose saat tombol escape ditekan', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('tidak memanggil onClose saat tombol selain escape ditekan', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('mengubah document.body.style.overflow menjadi hidden saat modal dimount', () => {
    render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  test('mengembalikan document.body.style.overflow menjadi visible saat modal diunmount', () => {
    const { unmount } = render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    
    expect(document.body.style.overflow).toBe('visible');
  });

  test('menghapus event listener saat komponen diunmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(
      <Modal onClose={mockOnClose}>
        {modalContent}
      </Modal>
    );
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });
});