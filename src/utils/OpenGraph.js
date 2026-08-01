export function generateOpenGraphImage({ title, description, prompt, tag, accent }) {
    return `/api/open-graph?${new URLSearchParams({ title, description, prompt, tag, accent }).toString()}`;
}
