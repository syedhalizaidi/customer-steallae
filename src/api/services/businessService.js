import api from './api';

export const businessService = {
    getBusinessCategories: async () => {
        try {
            const response = await api.get('/business/business-types');
            return {
                success: true,
                data: response.data.data,
                message: 'Business categories fetched successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch business categories.',
                details: error.response?.data
            };
        }
    },

    addBarberBusiness: async (data) => {
        try {
            const response = await api.post('/business', data);
            return {
                success: true,
                data: response.data.data,
                message: 'Barber business added successfully!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to add barber business.',
            };
        }
    },

    addCarDealershipBusiness: async (data) => {
        try {
            const response = await api.post('/business', data);
            return {
                success: true,
                data: response.data.data,
                message: 'Car dealership business added successfully!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to add car dealership business.',
            };
        }
    },

    updateBusiness: async (businessId, data) => {
        try {
            const response = await api.put(`/business/${businessId}`, data);
            return {
                success: true,
                data: response.data.data,
                message: 'Business updated successfully!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update business.',
                details: error.response?.data
            };
        }
    },

    updateRedirectUrl: async (businessId, redirectUrl) => {
        try {
            const response = await api.patch(`/business/${businessId}/redirect-url`, { redirect_url: redirectUrl });
            return {
                success: true,
                data: response.data.data,
                message: 'Redirect URL updated successfully!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update redirect URL.',
                details: error.response?.data
            };
        }
    },

    getBusinessById: async (businessId) => {
        try {
            const response = await api.get(`/business/${businessId}`);
            return {
                success: true,
                data: response.data,
                message: 'Business fetched successfully!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.message || 'Failed to fetch business.',
            };
        }
    },

    getPublicBusinessById: async (businessId) => {
        try {
            const response = await api.get(`/business/public/${businessId}`);
            return {
                success: true,
                data: response.data,
                message: 'Business fetched successfully!'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.response?.message || 'Failed to fetch business.',
            };
        }
    },

    getBusinesses: async () => {
        try {
            const response = await api.get('/business/my');
            return {
                success: true,
                data: response.data,
                message: 'Businesses fetched successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch businesses.',
                details: error.response?.data
            };
        }
    },

    getVoices: async () => {
        try {
            const response = await api.get('/eleven_labs/elevenlabs/voices');
            return {
                success: true,
                data: response.data,
                message: 'Voices fetched successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch voices.',
                details: error.response?.data
            };
        }
    },

    createVoice: async (voiceData) => {
        try {
            const response = await api.post('/voice', voiceData);
            return {
                success: true,
                data: response.data,
                message: 'Voice assigned successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to assign voice.',
            };
        }
    },

    updateVoice: async (businessId, voiceData) => {
        try {
            const response = await api.put(`/voice/${businessId}`, voiceData);
            return {
                success: true,
                data: response.data,
                message: 'Voice updated successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to update voice.',
            };
        }
    },
    submitContactForm: async (formData) => {
        try {
            const response = await api.post('/business/contact', formData);
            return {
                success: true,
                data: response.data,
                message: 'Contact form submitted successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to submit contact form.',
                details: error.response?.data
            };
        }
    },
    businessLink: async (businessId) => {
        try {
            const response = await api.post(`/v1/business/${businessId}/google-calendar/send-connect-email`);
            return {
                success: true,
                data: response.data,
                message: 'Authentication Email sent successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to send authentication email.',
                details: error.response?.data
            };
        }
    },
    createInstance: async (businessId, formData) => {
        try {
            const response = await api.post(`/business/${businessId}/instances`, formData);
            return {
                success: true,
                data: response.data,
                message: 'Instance created successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to create instance.',
                details: error.response?.data
            };
        }
    },
    instanceLink: async (instanceId) => {
        try {
            const response = await api.post(`/v1/instance/${instanceId}/google-calendar/send-connect-email`);
            return {
                success: true,
                data: response.data,
                message: 'Authentication Email sent successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to send authentication email.',
                details: error.response?.data
            };
        }
    },
    listInstances: async (businessId) => {
        try {
            const response = await api.get(`/business/${businessId}/instances`);
            return {
                success: true,
                data: response.data,
                message: 'Instances fetched successfully!'
            }

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch instances.',
                details: error.response?.data
            };
        }
    },
    getServices: async (businessId) => {
        try {
            const response = await api.get(`/v1/business/${businessId}/services`);
            return {
                success: true,
                data: response.data,
                message: 'Services fetched successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch services.'
            };
        }
    },
    createService: async (businessId, serviceData) => {
        try {
            const response = await api.post(`/v1/business/${businessId}/services`, serviceData);
            return {
                success: true,
                data: response.data,
                message: 'Service created successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create service.'
            };
        }
    },
    getStaffServices: async (businessId, instanceId) => {
        try {

            const response = await api.get(`/v1/business/${businessId}/instances/${instanceId}/pricing`);
            return {
                success: true,
                data: response.data,
                message: 'Staff services fetched successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch staff services.'
            };
        }
    },
    addStaffService: async (businessId, instanceId, pricingData) => {
        try {
            const response = await api.put(`/v1/business/${businessId}/instances/${instanceId}/pricing`, pricingData);
            return {
                success: true,
                data: response.data,
                message: 'Service price set successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to set service price.'
            };
        }
    },

    getUser: async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await api.get('/user/me', {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
            });

            // The API returns { status, message, data: { id, full_name, ... } }
            const userData = response.data?.data;
            const userId = userData?.id;
            
            if (userId) {
                localStorage.setItem('staff_id', userId);
            }

            return {
                success: true,
                data: userData,
                message: 'User fetched successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch user.',
                details: error.response?.data
            };
        }
    },
    deleteService: async (businessId, serviceId) => {
        try {
            await api.delete(`/v1/business/${businessId}/services/${serviceId}`);
            return { success: true, message: 'Service deleted successfully!' };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete service.'
            };
        }
    },

    updateMasterService: async (businessId, serviceId, serviceData) => {
        try {
            const response = await api.put(`/v1/business/${businessId}/services/${serviceId}`, serviceData);
            return {
                success: true,
                data: response.data,
                message: 'Service updated successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update service.'
            };
        }
    },

    verifyCheckoutSession: async (sessionId) => {
        try {
            const response = await api.get(`/stripe/verify-checkout-session/${sessionId}`);
            return {
                success: true,
                data: response.data,
                message: 'Checkout session verified successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to verify checkout session.'
            };
        }
    },

    createReservation: async (businessId, reservationData) => {
        try {
            const response = await api.post(`/v1/business/${businessId}/reservations`, reservationData);
            return {
                success: true,
                data: response.data,
                message: 'Reservation created successfully!'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.response?.data?.detail || 'Failed to create reservation.'
            };
        }
    },
};