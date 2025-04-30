# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the Development Server

To run the development server:

```bash
npm run dev
```

This will start the app, usually on port 9002. Open [http://localhost:9002](http://localhost:9002) in your browser.

## Accessing on Mobile

You can access the running development server from a mobile device on the same network:

1.  **Find your computer's local IP address:**
    *   **Windows:** Open Command Prompt (`cmd`) and type `ipconfig`. Look for the IPv4 address under your active network adapter (e.g., Wi-Fi or Ethernet).
    *   **macOS:** Open Terminal and type `ifconfig | grep "inet "`. Look for the address usually starting with `192.168.x.x` or `10.x.x.x`.
    *   **Linux:** Open Terminal and type `ip addr show`. Look for the `inet` address under your active network interface.
2.  **Connect your mobile device:** Ensure your phone or tablet is connected to the same Wi-Fi network as your computer.
3.  **Open the browser:** On your mobile device, open a web browser and navigate to `http://<your_computer_ip>:9002` (replace `<your_computer_ip>` with the IP address you found).
4.  **Firewall:** If you can't connect, check if your computer's firewall is blocking incoming connections on port 9002. You may need to create a rule to allow traffic on this port.

## Deployment

If the application is deployed to a hosting provider (like Firebase Hosting, Vercel, Netlify, etc.), you can access it on mobile simply by navigating to its public URL in your mobile browser.
