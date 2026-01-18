import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '595971123456';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `Hola, mi nombre es ${formData.name}.\n\nEmail: ${formData.email}\n\nMensaje: ${formData.message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-leather-50">
      {/* Header */}
      <div className="bg-leather-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-4xl font-bold text-white text-center">
            Contacto
          </h1>
          <p className="text-leather-300 text-center mt-2">
            Estamos aquí para ayudarte
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-leather-900 mb-6">
              Información de Contacto
            </h2>
            <p className="text-leather-600 mb-8">
              ¿Tienes alguna pregunta sobre nuestros productos o servicios? 
              No dudes en contactarnos, estaremos encantados de atenderte.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-leather-100 rounded-full">
                  <Phone size={24} className="text-leather-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-leather-900">Teléfono</h3>
                  <p className="text-leather-600">+595 982 630 043</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-leather-100 rounded-full">
                  <Mail size={24} className="text-leather-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-leather-900">Email</h3>
                  <p className="text-leather-600">info@relux.com.py</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-leather-100 rounded-full">
                  <MapPin size={24} className="text-leather-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-leather-900">Ubicación</h3>
                  <p className="text-leather-600">Asunción, Paraguay</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full bg-green-600 text-white py-4 rounded-sm font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={20} />
              Escribinos por WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-sm shadow-md p-8">
            <h2 className="font-serif text-2xl font-bold text-leather-900 mb-6">
              Envianos un mensaje
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-leather-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-leather-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-leather-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input-field resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={18} />
                Enviar mensaje
              </button>

              <p className="text-sm text-leather-500 text-center">
                Al enviar, serás redirigido a WhatsApp para continuar la conversación
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
