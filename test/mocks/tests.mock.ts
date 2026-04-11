export const MockConfigService = {
    get: vi.fn((key: string) => {
        if (key === 'app') {
            return {
                email: {
                    apiKey: 'api-key',
                    apiSecret: 'api-secret',
                    from: 'noreply@editalcerto.com',
                },
                observability: { logs: true, metric: true, trace: true }
            };
        }
        return null;
    }),
};