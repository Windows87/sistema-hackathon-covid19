class Modal {
  constructor({ elementQuery, onClose }) {
    this.element = document.querySelector(elementQuery);
    this.closeElement = document.querySelector(`${elementQuery}-exit`);
    this.closeElement.addEventListener('click', () => {
      this.close();
      onClose();
    });
  }

  isOpen() {
    return this.element.style['display'] === 'flex';
  }

  open() {
    this.element.style['display'] = 'flex';
  }

  close() {
    this.element.style['display'] = 'none';
  }
}