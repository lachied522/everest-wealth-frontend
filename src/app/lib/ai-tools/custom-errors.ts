

export class PortfolioIDUndefinedError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "PortfolioIDUndefinedError";
    }
}