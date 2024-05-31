/**
 * Service to manage the IP address of the user (i.e., the client making the
 * request)
 */
export interface IpService {
  /**
   * Gets the IP address of the user (i.e., the client making the request)
   * @returns The IP address of the user, or "0.0.0.0" if it could not be
   * detected
   */
  getIp(): Promise<string>;
}
