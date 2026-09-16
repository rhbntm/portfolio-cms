import posthog from '../lib/posthog';

/**
 * Analytics abstraction layer.
 * Decouples the application UI components from the underlying analytics provider (PostHog).
 * Keeps public tracking anonymous and focused on key portfolio interactions.
 */

export const trackPageView = (path) => {
  const currentPath = path || window.location.pathname;

  // Custom semantic event
  posthog.capture('page_viewed', {
    path: currentPath,
  });

  // Built-in PostHog event to populate the "Web Analytics" dashboard ("Top Pages", session duration, etc.)
  posthog.capture('$pageview', {
    $current_url: window.location.origin + currentPath,
    $pathname: currentPath,
  });
};

export const trackProjectView = ({ slug, title } = {}) => {
  posthog.capture('project_viewed', {
    project_slug: slug,
    project_title: title,
  });
};

export const trackProjectDemoClick = ({ slug, title } = {}) => {
  posthog.capture('project_demo_clicked', {
    project_slug: slug,
    project_title: title,
  });
};

export const trackProjectGithubClick = ({ slug, title } = {}) => {
  posthog.capture('project_github_clicked', {
    project_slug: slug,
    project_title: title,
  });
};

export const trackResumeDownload = () => {
  posthog.capture('resume_downloaded');
};

export const trackContactSubmit = () => {
  posthog.capture('contact_submitted');
};

export default {
  trackPageView,
  trackProjectView,
  trackProjectDemoClick,
  trackProjectGithubClick,
  trackResumeDownload,
  trackContactSubmit,
};
