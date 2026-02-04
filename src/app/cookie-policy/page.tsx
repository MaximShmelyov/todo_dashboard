import Card from "@/src/components/ui/Card";
import { getPageMetadata } from "@/src/lib/metadata";

export const metadata = getPageMetadata({
  title: "Cookie Policy",
});

export default async function CookiePolicy() {
  return (
    <div className="space-y-8 w-full max-w-full">
      <h2 className="text-2xl font-semibold tracking-tight">Cookie Policy</h2>

      <div className="space-y-6">
        <p className="text-sm text-gray-500">
          <strong>Effective date:</strong> 2026-02-04
        </p>

        <Card title="0. Overview">
          <p>
            This Cookie Policy explains how we use cookies and similar technologies on{" "}
            <strong>{process.env.SITE_DOMAIN}</strong> (the &quot;Service&quot;).
          </p>
          <div className="box my-4 p-4 bg-blue-50 dark:bg-stone-900 rounded">
            <p>
              <strong>Scope:</strong> This Service uses <strong>NextAuth</strong> for authentication
              via <strong>Google OAuth</strong>.
            </p>
            <p>
              <strong>Key point:</strong> We use cookies that are{" "}
              <strong>strictly necessary</strong> to sign you in and keep your session secure.
            </p>
          </div>
        </Card>

        <Card title="1. What are cookies?">
          <p>
            Cookies are small text files stored on your device when you visit a website. They are
            commonly used to make websites work, keep sessions secure, and remember preferences.
          </p>
        </Card>

        <Card title="2. Why we use cookies">
          <p>We use cookies primarily to:</p>
          <ul className="list-disc ml-6">
            <li>Authenticate you via Google OAuth (NextAuth sign-in flow)</li>
            <li>Maintain your signed-in session</li>
            <li>Protect against forgery and abuse (e.g., CSRF protection)</li>
            <li>Remember sign-in redirect destinations</li>
          </ul>
          <p>Without these cookies, sign-in and session management will not work correctly.</p>
        </Card>

        <Card title="3. Cookies we set (NextAuth)">
          <p>
            Based on your current configuration, the Service sets the following NextAuth cookies:
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border" aria-label="Cookies used by the Service">
              <thead>
                <tr>
                  <th className="border p-2">Cookie name</th>
                  <th className="border p-2">Purpose</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Observed / typical attributes</th>
                  <th className="border p-2">Typical retention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    <code>next-auth.session-token</code>
                  </td>
                  <td className="border p-2">
                    Stores the session token used to keep you signed in and identify your session.
                    (With JWT strategy, this cookie commonly contains a signed token.)
                  </td>
                  <td className="border p-2">Strictly necessary</td>
                  <td className="border p-2">
                    <ul className="list-disc ml-4">
                      <li>
                        <code>HttpOnly</code>: yes (observed)
                      </li>
                      <li>
                        <code>SameSite</code>: <code>Lax</code> (observed)
                      </li>
                      <li>
                        <code>Path</code>: <code>/</code> (observed)
                      </li>
                      <li>
                        <code>Secure</code>: typically <em>yes</em> in production over HTTPS
                      </li>
                    </ul>
                  </td>
                  <td className="border p-2">
                    Usually session-based or up to the configured NextAuth session lifetime
                    (commonly days/weeks).
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <code>next-auth.csrf-token</code>
                  </td>
                  <td className="border p-2">
                    CSRF protection for authentication-related actions (helps ensure requests are
                    coming from your browser).
                  </td>
                  <td className="border p-2">Strictly necessary</td>
                  <td className="border p-2">
                    <ul className="list-disc ml-4">
                      <li>
                        <code>HttpOnly</code>: yes (observed)
                      </li>
                      <li>
                        <code>SameSite</code>: <code>Lax</code> (observed)
                      </li>
                      <li>
                        <code>Path</code>: <code>/</code> (observed)
                      </li>
                      <li>
                        <code>Secure</code>: typically <em>yes</em> in production over HTTPS
                      </li>
                    </ul>
                  </td>
                  <td className="border p-2">Typically session (or short-lived).</td>
                </tr>
                <tr>
                  <td className="border p-2">
                    <code>next-auth.callback-url</code>
                  </td>
                  <td className="border p-2">
                    Stores the URL you should be redirected to after successful sign-in.
                  </td>
                  <td className="border p-2">Strictly necessary</td>
                  <td className="border p-2">
                    <ul className="list-disc ml-4">
                      <li>
                        <code>SameSite</code>: <code>Lax</code> (observed)
                      </li>
                      <li>
                        <code>Path</code>: <code>/</code> (observed)
                      </li>
                      <li>
                        <code>Secure</code>: typically <em>yes</em> in production over HTTPS
                      </li>
                    </ul>
                  </td>
                  <td className="border p-2">Typically session (or short-lived).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <strong>Note:</strong> In production, NextAuth may use cookie name prefixes like{" "}
            <code>__Secure-</code> or <code>__Host-</code>
            depending on your setup. Cookie names and lifetimes can also vary depending on your
            NextAuth configuration and whether you use JWT sessions or database sessions.
          </p>
        </Card>

        <Card title="4. Analytics / advertising cookies">
          <p>
            We do not use advertising cookies. If analytics or marketing cookies are added in the
            future, we will update this policy and, where required, provide a consent mechanism
            before setting non-essential cookies.
          </p>
        </Card>

        <Card title="5. Managing cookies">
          <p>
            You can control and delete cookies via your browser settings. Most browsers let you:
          </p>
          <ul className="list-disc ml-6">
            <li>View stored cookies</li>
            <li>Delete all or selected cookies</li>
            <li>Block cookies for specific sites</li>
            <li>Block all cookies</li>
          </ul>
          <p>
            If you block strictly necessary cookies, the Service (including sign-in) may not
            function correctly.
          </p>
        </Card>

        <Card title="6. Updates to this policy">
          <p>
            We may update this Cookie Policy from time to time. We will update the effective date at
            the top of this page when changes are made.
          </p>
        </Card>

        <Card title="7. Contact">
          <p>If you have questions about this Cookie Policy, contact us:</p>
          <ul>
            <li>
              Email: <strong>{process.env.SUPPORT_EMAIL}</strong>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
